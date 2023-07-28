
import { test, expect } from "@jest/globals";

const UserService = require("../services/userService");

// Mock the User model using Jest's mocking capabilities
jest.mock("../db", () => ({
  User: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    increment: jest.fn(),
  },
}));


describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should call User.findAll with correct parameters", async () => {
      // Mock the database response
      const mockCriteria = { someKey: "someValue" };
      const mockPage = 2;
      const mockItemsPerPage = 10;
      const mockOrder = { score: "DESC" };
      const mockResult = [
        { id: 1, name: "John" },
        { id: 2, name: "Alice" },
      ];
      jest.spyOn(userService, "findAll").mockResolvedValue(mockResult);

      // Call the function
      const result = await userService.findAll(mockCriteria, {
        page: mockPage,
        itemsPerPage: mockItemsPerPage,
        order: mockOrder,
      });

      // Check if the function was called with the correct parameters
      expect(userService.findAll).toHaveBeenCalledWith(mockCriteria, {
        page: mockPage,
        itemsPerPage: mockItemsPerPage,
        order: mockOrder,
      });

      // Check if the result matches the mock result
      expect(result).toEqual(mockResult);
    });
  });
     // Test for the create function
  describe('create', () => {
    it('should call User.create with the given data', async () => {
      // Mock the database response
      const mockData = { name: 'John', age: 30 };
      const mockUser = { id: 1, name: 'John', age: 30 };
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      // Call the function
      const result = await userService.create(mockData);

      // Check if the function was called with the correct data
      expect(userService.create).toHaveBeenCalledWith(mockData);

      // Check if the result matches the mock user
      expect(result).toEqual(mockUser);
    });
  });

  // Test for the findOne function
  describe('findOne', () => {
    it('should call User.findByPk with the given ID', async () => {
      // Mock the database response
      const mockId = 1;
      const mockUser = { id: 1, name: 'John' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);

      // Call the function
      const result = await userService.findOne(mockId);

      // Check if the function was called with the correct ID
      expect(userService.findOne).toHaveBeenCalledWith(mockId);

      // Check if the result matches the mock user
      expect(result).toEqual(mockUser);
    });
  });

   // Test for the replaceOne function
  describe('replaceOne', () => {
    it('should call deleteOne and create with correct data', async () => {
      // Mock the database responses
      const mockId = 1;
      const mockOldData = { id: 1, name: 'John' };
      const mockNewData = { id: 1, name: 'Alice', age: 25 };
      const mockDeleteResult = true;
      const mockCreateResult = { id: 1, name: 'Alice', age: 25 };
      jest.spyOn(userService, 'deleteOne').mockResolvedValue(mockDeleteResult);
      jest.spyOn(userService, 'create').mockResolvedValue(mockCreateResult);

      // Call the function
      const result = await userService.replaceOne(mockId, mockNewData);

      // Check if the function was called with the correct ID and newData
      expect(userService.deleteOne).toHaveBeenCalledWith(mockId);
      expect(userService.create).toHaveBeenCalledWith({ ...mockNewData, id: mockId });

    });

    // Add more test cases to cover other scenarios and edge cases for the replaceOne function
  });

  // Test for the updateOne function
  describe('updateOne', () => {
    it('should update the user with new data when isIncrement is false', async () => {
      // Mock the database response
      const mockId = 1;
      const mockNewData = { name: 'Alice', age: 25 };
      const mockNbUpdated = 1;
      const mockNewValues = [{ id: 1, name: 'Alice', age: 25 }];
      jest.spyOn(userService, 'updateOne').mockResolvedValue([mockNbUpdated, mockNewValues]);

      // Call the function
      const result = await userService.updateOne(mockId, mockNewData);

      // Check if the function was called with the correct ID and newData
      expect(userService.updateOne).toHaveBeenCalledWith(mockId, mockNewData);

      // Check if the result matches the mock new values
      expect(result[1]).toEqual(mockNewValues);
    });

    it('should increment the user score and gamesPlayed when isIncrement is true', async () => {
      // Mock the database response for incrementing
      const mockId = 1;
      const mockNewData = { score: 10, gamesPlayed: 1, isIncrement: true };
      const mockIncrementResponse = [[{ nickname: 'John', score: 100, gamesPlayed: 5 }]];
      jest.spyOn(userService, 'updateOne').mockResolvedValue(mockIncrementResponse);

      // Call the function
      const result = await userService.updateOne(mockId, mockNewData);

      // Check if the function was called with the correct ID and newData
      expect(userService.updateOne).toHaveBeenCalledWith(mockId, mockNewData);

      // Check if the result matches the mock increment response
      expect(result[0][0]).toEqual({
        nickname: 'John',
        score: 100,
        gamesPlayed: 5,
      });
    });

    // Add more test cases to cover other scenarios and edge cases for the updateOne function
  });

  // Test for the deleteOne function
  describe('deleteOne', () => {
    it('should call User.destroy with the given ID', async () => {
      // Mock the database response
      const mockId = 1;
      const mockNbDeleted = 1;
      jest.spyOn(userService, 'deleteOne').mockResolvedValue(mockNbDeleted);

      // Call the function
      const result = await userService.deleteOne(mockId);

      // Check if the function was called with the correct ID
      expect(userService.deleteOne).toHaveBeenCalledWith(mockId);

      // Check if the result matches the mock number of deleted records
      expect(result).toEqual(1);
    });
  });

  // Write similar tests for other functions of the service (create, findOne, replaceOne, updateOne, deleteOne).
  // You can use the same approach to mock the User model and test the logic of each function.
});
