import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from './../src/api.module';
import { KnowledgeBaseService } from '@lib/knowledge-base';

describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('KnowledgeBaseController (e2e)', () => {
  let app: INestApplication;
  let knowledgeBaseService: jest.Mocked<KnowledgeBaseService>;

  beforeEach(async () => {
    const mockKnowledgeBaseService = {
      similaritySearch: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    })
      .overrideProvider(KnowledgeBaseService)
      .useValue(mockKnowledgeBaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    knowledgeBaseService = moduleFixture.get(KnowledgeBaseService);
  });

  it('/GET knowledge-base/search', () => {
    const mockResults = [
      { content: 'Result 1', metadata: { source: 'Source 1' } },
      { content: 'Result 2', metadata: { source: 'Source 2' } },
    ];
    knowledgeBaseService.similaritySearch.mockResolvedValue(mockResults);

    return request(app.getHttpServer())
      .get('/knowledge-base/search?query=test&limit=2')
      .expect(200)
      .expect(mockResults);
  });

  afterAll(async () => {
    await app.close();
  });
});
