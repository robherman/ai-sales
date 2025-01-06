import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { SentimentAnalyzer } from 'natural';

@Injectable()
export class SentimentAnalysisService {
  private classifier: natural.BayesClassifier;
  private sentimentAnalyzer: SentimentAnalyzer;
  private tokenizer: natural.RegexpTokenizer;

  constructor() {
    this.initializeClassifier();
    this.sentimentAnalyzer = new SentimentAnalyzer(
      'Spanish',
      undefined,
      'afinn',
    );
    this.tokenizer = new natural.WordTokenizer();
  }

  private initializeClassifier() {
    this.classifier = new natural.BayesClassifier();

    // Train the classifier with sample data
    this.classifier.addDocument('Quiero comprar', 'buy');
    this.classifier.addDocument('Me gustaría adquirir', 'buy');
    this.classifier.addDocument('Deseo devolver este producto', 'return');
    this.classifier.addDocument('Quiero hacer una devolución', 'return');
    this.classifier.addDocument('Tengo un problema con mi pedido', 'complaint');
    this.classifier.addDocument(
      'No estoy satisfecho con el servicio',
      'complaint',
    );
    this.classifier.addDocument('Me encantó el producto', 'feedback');
    this.classifier.addDocument('Quiero compartir mi experiencia', 'feedback');

    this.classifier.train();
  }

  analyzeInput(input: string): { intent: string; sentiment: string } {
    const intent = this.classifyIntent(input);
    const sentiment = this.analyzeSentiment(input);

    return { intent, sentiment };
  }

  private classifyIntent(input: string): string {
    return this.classifier.classify(input);
  }

  async analyzeSentimentWithScore(
    text: string,
  ): Promise<{ score: number; comparative: number }> {
    const tokens = this.tokenizer.tokenize(text);
    const result = this.sentimentAnalyzer.getSentiment(tokens);
    return {
      score: result,
      comparative: result / tokens.length,
    };
  }

  private analyzeSentiment(input: string): string {
    const result = this.sentimentAnalyzer.getSentiment(input.split(' '));
    if (result > 0) return 'positive';
    if (result < 0) return 'negative';
    return 'neutral';
  }
}
