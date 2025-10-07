import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "NestJS API is running!"', () => {
      const result = appController.getHello();
      expect(result).toBe('NestJS API is running!');
    });

    it('should return a string', () => {
      const result = appController.getHello();
      expect(typeof result).toBe('string');
    });

    it('should not return null or undefined', () => {
      const result = appController.getHello();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });
  });
});
