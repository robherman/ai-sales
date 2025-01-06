import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

@Injectable()
export class NlpService {
  private classifier: natural.BayesClassifier;

  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.trainClassifier();
  }

  private trainClassifier() {
    // Train the classifier with sample data
    this.classifier.addDocument('What are your prices?', 'pricing');
    this.classifier.addDocument('How much does it cost?', 'pricing');
    this.classifier.addDocument('Tell me about your product', 'product_info');
    this.classifier.addDocument('What features do you offer?', 'product_info');
    this.classifier.addDocument('Can I schedule a demo?', 'demo_request');
    this.classifier.addDocument(`I'd like to see it in action`, 'demo_request');

    // Add more training data as needed
    this.classifier.train();
  }

  async detectIntent(input: string): Promise<string> {
    return this.classifier.classify(input);
  }
}
