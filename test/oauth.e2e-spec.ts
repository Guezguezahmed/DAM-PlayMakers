import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');


describe('OAuth redirect endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Ensure strategies are registered for the test by providing dummy credentials.
    process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy-google-id';
    process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-secret';
    process.env.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/redirect';

    process.env.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || 'dummy-facebook-id';
    process.env.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'dummy-facebook-secret';
    process.env.FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/facebook/redirect';

    // Provide a JWT secret required by our config validation
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_oauth_tests_123456';

    // Import AppModule after env vars are set so ConfigModule.forRoot validates correctly
    const { AppModule } = require('./../src/app.module');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

  app = moduleRef.createNestApplication();
  // The real app sets a global prefix '/api/v1' in main.ts — replicate here for tests
  app.setGlobalPrefix('api/v1');
  await app.init();
  }, 20000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /api/v1/auth/google should redirect to Google (302)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/auth/google').expect(302);
    expect(res.headers.location).toMatch(/accounts\.google\.com|google/);
  });

  it('GET /api/v1/auth/facebook should redirect to Facebook (302)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/auth/facebook').expect(302);
    expect(res.headers.location).toMatch(/facebook\.com|facebook/);
  });
});
