import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { AiService } from '../../../ai-core/src';
import { BedrockModel } from '../../../ai-core/src/const/models.const';

@Injectable()
export class ConversationFlowService {
  private logger = new Logger();

  constructor(private aiService: AiService) {}

  async process(
    steps: any,
    currentStepId: string,
    userMessage: string,
    context: any,
    conversationHistory: any[],
  ) {
    const systemPrompt = `
Eres un asistente de ventas AI para una tienda en línea. Tu tarea es guiar la conversación a través de los pasos de venta mientras utilizas las herramientas disponibles para ayudar al cliente.

Pasos de la conversación:
${JSON.stringify(steps, null, 2)}

Sigue estas instrucciones:
1. Analiza el historial de la conversación, el mensaje del cliente y el contexto proporcionado.
2. Compara el contenido del mensaje y el flujo de la conversación con los pasos de la conversación definidos.
3. Considera el paso actual y determina si es apropiado avanzar, retroceder o mantener el mismo paso.
4. Sugiere el ID del siguiente paso más apropiado basándote en tu análisis.
5. Proporciona una breve justificación de tu elección (máximo 20 palabras).
`;

    const userPrompt = `
Paso actual: ${currentStepId}
Mensaje del cliente: "${userMessage}"
Contexto: ${JSON.stringify(context)}
Historial de conversación:
${JSON.stringify(conversationHistory, null, 2)}

Determina el siguiente paso y la herramienta a utilizar. Luego, responde al cliente.
Responde ÚNICAMENTE con el siguiente formato:
{
  "nextStepId": "ID_DEL_SIGUIENTE_PASO",
  "justification": "Breve justificación de la elección",
  "tools": ["id_herramienta"] 
}

`;

    const response = await this.aiService.generateObjectResponse({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: BedrockModel.CLAUDE_3_HAIKU,
      temperature: 0.2,
      maxTokens: 100,
      schema: z.object({
        nextStepId: z.string(),
        justification: z.string(),
        // tools: z.array(z.string()),
      }),
    });

    return { ...response.content };
  }

  // private async handleSalesFlow(
  //   chat: ChatEntity,
  //   aiResponse: string,
  // ): Promise<void> {
  //   try {
  //     const currentStepId = chat.currentStep?.id;
  //     if (!currentStepId) {
  //       this.logger.warn('Current step ID is undefined');
  //       return;
  //     }
  //     const flowHandler = this.getSalesFlowHandler(currentStepId);
  //     this.logger.debug(`Step Handler: `, {
  //       handlerName: flowHandler?.name,
  //     });
  //     if (flowHandler) {
  //       await flowHandler.call(this, chat, aiResponse);
  //     } else {
  //       this.logger.warn(`No handler found for step: ${currentStepId}`);
  //     }
  //   } catch (error) {
  //     this.logger.error(`Failed to handle conversation Flow: `, error);
  //   }
  // }

  // private getSalesFlowHandler(
  //   stepId: string,
  // ): ((chat: ChatEntity, aiResponse: string) => Promise<void>) | null {
  //   const handlers: Record<string, any> = {
  //     '1': this.handleConversationStart,
  //     '2': this.handleNewOrder,
  //     '3': this.handleCartUpdate,
  //     '4': this.handleCrossSelling,
  //     '6': this.handleOrderCompletion,
  //     '7': this.handleConversationEnd,
  //     '8': this.handleRepeatLastOrder,
  //   };
  //   return handlers[stepId] || null;
  // }

  // private async handleConversationStart(chat: ChatEntity): Promise<void> {
  //   const greeting = await this.chatbotService.getGreetingMessage(
  //     chat.chatbotId!,
  //     chat.userId!,
  //     chat.strategy as any,
  //   );
  //   await this.chatService.updateChat(chat.id, { greeting });
  // }

  // private async handleNewOrder(chat: ChatEntity): Promise<void> {
  //   const recommendations = await this.toolService.runTool(
  //     'getProductsRecommendations',
  //     { customerId: chat.customerId },
  //   );
  //   await this.chatService.updateChat(chat.id, {
  //     additionalMetadata: { ...chat.additionalMetadata, recommendations },
  //   });
  // }

  // private async handleCartUpdate(
  //   chat: ChatEntity,
  //   aiResponse: string,
  // ): Promise<void> {
  //   const cartUpdates = this.extractCartUpdates(aiResponse);
  //   const updatedCart = await this.toolService.runTool('updateCart', {
  //     chatId: chat.id,
  //     updates: cartUpdates,
  //   });
  //   await this.chatService.updateChat(chat.id, { shoppingCart: updatedCart });
  // }

  // private extractCartUpdates(aiResponse: string) {
  //   // Implement logic to extract cart updates from AI response
  //   return {};
  // }

  // private async handleCrossSelling(chat: ChatEntity): Promise<void> {
  //   if (!chat.additionalMetadata?.crossSellingApplied) {
  //     const crossSellingRecommendations = await this.toolService.runTool(
  //       'getProductsRecommendations',
  //       {
  //         customerId: chat.customerId,
  //         excludeCategories: chat.shoppingCart?.items?.map(
  //           (item: any) => item.category,
  //         ),
  //       },
  //     );
  //     await this.chatService.updateChat(chat.id, {
  //       additionalMetadata: {
  //         ...chat.additionalMetadata,
  //         crossSellingRecommendations,
  //         crossSellingApplied: true,
  //       },
  //     });
  //   }
  // }

  // private async handleOrderCompletion(chat: ChatEntity): Promise<void> {
  //   const checkoutUrl = await this.toolService.runTool('generateCheckoutUrl', {
  //     chatId: chat.id,
  //   });
  //   await this.chatService.updateChat(chat.id, {
  //     additionalMetadata: {
  //       ...chat.additionalMetadata,
  //       checkoutUrl,
  //     },
  //   });
  // }

  // private async handleConversationEnd(chat: ChatEntity): Promise<void> {
  //   await this.chatService.updateChat(chat.id, {
  //     additionalMetadata: {
  //       ...chat.additionalMetadata,
  //       conversationEnded: true,
  //     },
  //   });
  // }

  // private async handleRepeatLastOrder(chat: ChatEntity): Promise<void> {
  //   const { lastOrder } = chat.context;
  //   if (lastOrder) {
  //     const updatedCart = await this.toolService.runTool('updateCart', {
  //       chatId: chat.id,
  //       items: lastOrder?.items?.map((item: any) => ({
  //         productId: item.productId,
  //         quantity: item.quantity,
  //       })),
  //     });
  //     await this.chatService.updateChat(chat.id, { shoppingCart: updatedCart });
  //   }
  // }
}
