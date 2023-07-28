import { GameService } from "../services/gameService";
import { test } from "@jest/globals";
import { Game } from "../db/mongo/models/Game";
import e from "express";

const gameService = new GameService();

describe("GameService", () => {
  // Test pour la getUsersWithWinsLast7Days
  // describe("getUsersWithWinsLast7Days", () => {
  //   it("should return an array of users", async () => {
  //     // Appelez la méthode getUsersWithWinsLast7Days du service
  //     const users = await gameService.getUsersWithWinsLast7Days();

  //     expect(Array.isArray(users)).toBe(true);
  //     expect(users.length).toBeGreaterThan(0);
  //   });
  // });

  // Test pour la méthode create
  describe("create", () => {
    it("should throw an error if validation fails", async () => {
      // Vous pouvez remplacer les données selon vos besoins de test
      const invalidData = {
        name: "test",
        description: "test",
      };

      // Appelez la méthode create du service avec des données invalides
      try {
        await gameService.create(invalidData);
        // Si la promesse n'est pas rejetée, le test échouera car une erreur de validation était attendue
        expect(true).toBe(false);
      } catch (error) {
        // Vérifiez que l'erreur est bien une erreur de validation
        expect(error.name).toBe("ValidationError");
        // Vérifiez d'autres propriétés de l'erreur si nécessaire
      }
    });
  });
});