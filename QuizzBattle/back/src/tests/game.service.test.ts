import { GameService } from "../services/gameService";
import { test } from "@jest/globals";
import { Game } from "../db/mongo/models/Game";

const gameService = new GameService();

// Mock the Game model using Jest's mocking capabilities


describe("GameService", () => {


  describe("create", () => {
    it("should call Game.create with the given data", async () => {
      // Mock the database response
      const mockData = {
        score: 100,
        username: "John",
        quizzName: "Quizz1",
        userId: 1,
        quizzId: 1,
        isWinner: true,
        isDraw: false,
        userVsID: 2,
      };
              const mockGame = {
                score: 100,
                username: "John",
                quizzName: "Quizz1",
                userId: 1,
                quizzId: 1,
                isWinner: true,
                isDraw: false,
                userVsID: 2,
              };



      // Call the function
      const result = await gameService.create(mockData);

      // Check if the function was called with the correct data
      expect(Game.create).toHaveBeenCalledWith(mockData);

      // Check if the result matches the mock game
      expect(result).toEqual(mockGame);
    });

    // it("should throw a ValidationErrorr for Sequelize validation errors", async () => {
    //   // Mock the database response to throw a Sequelize validation error
    //   const mockData = { invalidField: "invalidValue" };
    //     // const mockValidationError = new Sequelize.ValidationError();
    //     Game.create(mockData);

    // });

    it("should throw an error for unexpected database errors", async () => {
      // Mock the database response to throw an unexpected error
      const mockData = { score: 100, username: "John", quizzName: 1, userId: 1, quizzId: 1, isWinner: true, isDraw: false, userVsID: 2};
      const mockError = new Error("Unexpected error occurred");
      Game.create(mockData);
      Game.create = jest.fn().mockRejectedValue(mockError);

      // Call the function and expect it to throw the error
    //   await expect(gameService.create(mockData)).rejects.toThrow(mockError);
    });
  });

  // You can add more tests for other functions in the GameService class, if any.
});
