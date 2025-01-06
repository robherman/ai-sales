import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProductsService } from '../../products/src';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { AiService } from '../../ai-core/src';
import { ProductEntity } from '../../products/src/entities/product.entity';
import { BedrockModel } from '../../ai-core/src/const/models.const';
import { z } from 'zod';

@Injectable()
export class ProductSearchService implements OnModuleInit {
  private logger = new Logger(ProductSearchService.name);
  private store: MemoryVectorStore;

  constructor(
    private productsService: ProductsService,
    private aiService: AiService,
  ) {}

  onModuleInit() {
    // this.init();
  }

  private async writeProductsJson() {
    try {
      const products = await this.productsService.findAll({
        limit: 300,
        order: 'ASC',
        orderBy: 'name' as any,
      });
      await writeFile(
        join(process.cwd(), 'data', 'products.json'),
        JSON.stringify(products),
      );
    } catch (error) {
      this.logger.error(`Failed to load products`, error);
    }
  }

  private async init() {
    try {
      this.logger.log(`Initialize ProductsSearch`);
      await this.writeProductsJson();

      // Load
      const productsLoader = new JSONLoader(
        join(process.cwd(), 'data', 'products.json'),
      );
      const productsDocs = await productsLoader.load();

      // Split
      const productsSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      const productsSplitted =
        await productsSplitter.splitDocuments(productsDocs);

      // Store
      this.store = new MemoryVectorStore(this.aiService.getEmbeddingInstance());
      await this.store.addDocuments(productsSplitted);

      this.logger.debug(
        `Store initialized: ${productsSplitted.length} added documents`,
      );
    } catch (error) {
      this.logger.error(`Failed to init Search`, error);
    }
  }

  getProductsRetriever() {
    return this.store?.asRetriever();
  }

  async similaritySearch(query: string, k = 2, filter?: Record<string, any>) {
    const results = await this.store.similaritySearch(
      query,
      k,
      // filter,
    );

    return results;
  }

  async similaritySearchWithScore(
    query: string,
    k = 2,
    filter?: object | string,
  ) {
    const results = await this.store.similaritySearchWithScore(
      query,
      k,
      // filter,
    );

    return results;
  }

  async queryRetriever(query: string, k = 2) {
    const retriever = this.store.asRetriever({
      // filter: filter,
      k,
    });

    await retriever.invoke(query);
  }

  async queryMMR(query: string, k = 2, fetchK = 10) {
    const mmrRetriever = this.store.asRetriever({
      searchType: 'mmr',
      searchKwargs: {
        fetchK,
      },
      // filter: filter,
      k,
    });

    await mmrRetriever.invoke(query);
  }

  async searchProducts(
    query: string,
    limit: number = 5,
  ): Promise<ProductEntity[]> {
    try {
      const context = await this.buildContext(query);
      const productIds = await this.generateAISearch(context, limit);
      if (!productIds || productIds?.length <= 0) {
        return [];
      }
      return this.fetchProducts(productIds, limit);
    } catch (error) {
      this.logger.error(`Error searching for products ${query}`, error.stack);
      throw new Error('Failed to generate search');
    }
  }

  private async fetchProducts(
    productIds: string[],
    limit: number,
  ): Promise<ProductEntity[]> {
    return this.productsService.findRecommendations(productIds, limit);
  }

  private async buildContext(query: string): Promise<any> {
    const [productCatalog] = await Promise.all([
      this.productsService.findAll({ limit: 250 }),
    ]);
    return {
      query,
      allProducts: productCatalog.products.map((p) => ({
        id: p.id,
        sku: p.sku,
        commonName: p.commonName,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        unitLabel: p.unitLabel,
        packageUnit: p.packageUnit,
        packageLabel: p.packageLabel,
        packageUnitPrice: p.packageUnitPrice,
      })),
    };
  }

  private mapProductsToContext(
    products: Array<ProductEntity>,
    productMap: Map<string, any>,
  ): Array<Partial<Record<string, any>>> {
    return products.map((product) => ({
      ...product,
    }));
  }

  private async generateAISearch(
    context: { allProducts: Array<ProductEntity>; query: string },
    limit: number,
  ): Promise<string[]> {
    const systemPrompt = `Como experto en búsqueda de productos debes realizar una búsqueda y generar una lista de ${limit} IDs de productos que coincidan la búsqueda del usuario. 
Debes usar el catálogo de productos del contexto.
Reglas:
- Busca productos similares por nombre, sku, categoría.
- Asegúrate de que todos los ID de productos existan en el catálogo de productos proporcionado.
- Ordena el resultado por mayor relevancia primero.
`;

    const humanPrompt = `<context>
Catálogo de productos:
${JSON.stringify(context.allProducts, null, 2)}

Búsqueda del usuario: ${context.query}
    </context>`;

    const aiResponse = await this.aiService.generateObjectResponse({
      model: BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0.2,
      maxTokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: humanPrompt },
      ],
      schema: z.object({
        products: z
          .array(
            z.object({
              id: z.string().describe('Id del producto'),
              name: z.string().describe('Nombre del producto'),
              // matchedKeywords: z
              //   .string()
              //   .describe('Palabras clave de la coincidencia'),
              score: z
                .number()
                .min(0)
                .max(1)
                .describe(
                  'Nivel de relevancia del producto encontrado (0 no relevante; 1 relevante)',
                ),
            }),
          )
          .describe(`Lista de productos encontrados`),
      }),
    });

    return this.parseAIResponse(aiResponse.content);
  }

  private parseAIResponse(content: any): string[] {
    try {
      const { products } = content;
      this.logger.debug(`matched search ids`, products);
      return products.map((r: any) => r.id);
    } catch (error) {
      this.logger.error('Failed to parse AI Search', error);
      throw new Error('Failed to generate valid Search');
    }
  }

  private generateProductContextString(products: ProductEntity[]): string {
    return products
      .map(
        (product) =>
          `ID: ${product.id}, SKU: ${product.sku}, Nombre: ${product.commonName}, ` +
          `Categoría: ${product.category}, Subcategoría: ${product.subcategory}, ` +
          `Precio: ${product.price} ${product.unitLabel}, ` +
          `Unidad de empaque: ${product.packageUnit} ${product.packageLabel}, ` +
          `Precio por unidad de empaque: ${product.packageUnitPrice}`,
      )
      .join('\n');
  }
}
