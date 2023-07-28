import AnswerService from "../services/answerService";
import { test, expect } from '@jest/globals';

const answerService = new AnswerService();

describe('AnswerService', () => {
    // Test pour la méthode findAll
    describe('findAllBy', () => {
        it('should return an array of answers', async () => {
            // Vous pouvez remplacer les critères et les options selon vos besoins de test
            const categoryId = 1;

            // Appelez la méthode findAll du service
            const answers = await answerService.findAllBy(categoryId);

            // Assurez-vous que le résultat est un tableau d'objets
            expect(Array.isArray(answers)).toBe(true);
            expect(answers.length).toBeGreaterThan(0);
        });
    });
  
    // Test pour la méthode create
    describe('create', () => {
      it('should throw an error if validation fails', async () => {
        // Vous pouvez remplacer les données selon vos besoins de test
        const invalidData = {
          name: 'test',
          description: 'test',
        };
  
        // Appelez la méthode create du service avec des données invalides
        try {
          await answerService.create(invalidData);
          // Si la promesse n'est pas rejetée, le test échouera car une erreur de validation était attendue
          expect(true).toBe(false);
        } catch (error) {
          // Vérifiez que l'erreur est bien une erreur de validation
          expect(error.name).toBe('TypeError');
          // Vérifiez d'autres propriétés de l'erreur si nécessaire
        }
      });
    });
});