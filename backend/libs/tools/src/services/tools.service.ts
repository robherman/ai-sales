import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ToolEntity } from '../entities/tool.entity';
import { In, Repository } from 'typeorm';
import { ProductSearchTool } from '../tools/product-search-tool';
import { ProductInfoTool } from '../tools/product-info-tool';
import { ApplyDiscountTool } from '../tools/apply-discount-tool';
import { ClearCartTool } from '../tools/clear-cart-tool';
import { ConfirmCartTool } from '../tools/confirm-cart-tool';
import { RecommendationsTool } from '../tools/recommendations-tool';
import { RepeatLastPurchaseTool } from '../tools/repeat-last-purchase-tool';
import { UpdateCartTool } from '../tools/update-cart-tool';
import { ProductRetrieverTool } from '../tools/product-retriever-tool';

@Injectable()
export class ToolsService {
  private logger = new Logger(ToolsService.name);

  constructor(
    @InjectRepository(ToolEntity)
    private toolRepository: Repository<ToolEntity>,
    private productSearchTool: ProductSearchTool,
    private productInfoTool: ProductInfoTool,
    private applyDiscountTool: ApplyDiscountTool,
    private clearCartTool: ClearCartTool,
    private confirmCartTool: ConfirmCartTool,
    private recommendationsTool: RecommendationsTool,
    private repeatLastPurchaseTool: RepeatLastPurchaseTool,
    private updateCartTool: UpdateCartTool,
    private productsRetrieverTool: ProductRetrieverTool,
  ) {}

  async createTool(toolData: Partial<ToolEntity>): Promise<ToolEntity> {
    const tool = this.toolRepository.create(toolData);
    return this.toolRepository.save(tool);
  }

  async updateTool(
    id: string,
    toolData: Partial<ToolEntity>,
  ): Promise<ToolEntity> {
    await this.toolRepository.update(id, toolData);
    return this.toolRepository.findOneOrFail({ where: { id } });
  }

  async deleteTool(id: string): Promise<void> {
    await this.toolRepository.delete(id);
  }

  async getTools() {
    return await this.toolRepository.find();
  }

  async getToolById(id: string) {
    try {
      const tool = await this.toolRepository.findOneBy({ id });
      return tool;
    } catch (error) {
      this.logger.error(`Failed to get tool ${id}`, error);
      throw error;
    }
  }

  async getToolByName(name: string) {
    try {
      const tool = await this.toolRepository.findOneBy({ name });
      return tool;
    } catch (error) {
      this.logger.error(`Failed to get tool ${name}`, error);
      throw error;
    }
  }

  async getToolByNames(names: string[]) {
    try {
      const tool = await this.toolRepository.find({
        where: { name: In(names) },
      });
      return tool;
    } catch (error) {
      this.logger.error(`Failed to get tool `, error);
      throw error;
    }
  }

  async getToolDefinitions(): Promise<Record<string, any>> {
    const tools = await this.toolRepository.find({ where: { isActive: true } });

    // return tools.reduce((acc: any, tool) => {
    //   acc[tool.name] = aiTool({
    //     description: tool.description,
    //     parameters: tool.parameters as any,
    //     execute: async (args: any) => {
    //       const handler = this.toolFactory.getHandler(tool.function);
    //       return handler(args);
    //     },
    //   });
    //   return acc;
    // }, {});

    return {};
  }

  getLcTools() {
    const productSearch = this.productSearchTool.createLcTool();
    const ProductInfo = this.productInfoTool.createLcTool();
    const applyDiscount = this.applyDiscountTool.createLcTool();
    const confirmCart = this.confirmCartTool.createLcTool();
    const recommendations = this.recommendationsTool.createLcTool();
    const repeatLastPurchase = this.repeatLastPurchaseTool.createLcTool();
    const updateCart = this.updateCartTool.createLcTool();
    const clearCart = this.clearCartTool.createLcTool();
    const productsRetrieverTool = this.productsRetrieverTool.createLcTool();

    return [
      productSearch,
      ProductInfo,
      applyDiscount,
      confirmCart,
      recommendations,
      repeatLastPurchase,
      updateCart,
      clearCart,
      productsRetrieverTool,
    ];
  }

  async executeToolByName(toolName: string, args: any) {
    const tool = await this.toolRepository.findOne({
      where: { name: toolName, isActive: true },
    });
    if (!tool) {
      throw new Error(`Unknown or inactive tool: ${toolName}`);
    }

    // const handler = this.toolFactory.getHandler(tool.function, args);
    return null;
  }
}
