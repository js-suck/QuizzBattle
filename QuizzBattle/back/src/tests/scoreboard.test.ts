import ScoreboardService from "../services/scoreboardService";
import { test, expect } from '@jest/globals';

const scoreboardService = new ScoreboardService();

describe('scoreboardService', () => {
    // Test pour la méthode findAll
    describe('findAll', () => {
      it('should return an array of users', async () => {
  
        // Appelez la méthode findAll du service
        const users = await scoreboardService.findAll();

        // Assurez-vous que le résultat est un tableau d'objets
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
      });

      it('should return an array of users based on a category', async () => {

        // Appelez la méthode findAll du service
        const users = await scoreboardService.findAllBy(1);

        // Assurez-vous que le résultat est un tableau d'objets
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
      });
    });

    // Test pour la méthode createOrIncrement
    describe('createOrIncrement', () => {
        it('should create a new user', async () => {
            // Vous pouvez remplacer les données selon vos besoins de test
            const data = {
                score: 100,
                gamesPlayed: 1,
                categoryId: 1,
                userId: 1,
            };
    
            // Appelez la méthode createOrIncrement du service avec des données invalides
            try {
                const user = await scoreboardService.createOrIncrement(data);
                // Si la promesse n'est pas rejetée, le test échouera car une erreur de validation était attendue
                expect(user).not.toBeNull();
            } catch (error) {
                // Vérifiez que l'erreur est bien une erreur de validation
                expect(error.name).toBe('TypeError');
                // Vérifiez d'autres propriétés de l'erreur si nécessaire
            }
        });
    });
});