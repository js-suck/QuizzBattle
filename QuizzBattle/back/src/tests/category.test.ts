import CategoryService from "../services/categoryService";
import { test, expect } from '@jest/globals';
// const { Category } = require('../models');
const Category = require('../models').Category;

const categoryService = new CategoryService();

describe('CategoryService', () => {
    // Test pour la méthode findAll
    describe('findAll', () => {
      it('should return an array of categories', async () => {
        // Vous pouvez remplacer les critères et les options selon vos besoins de test
        const criteria = { /* Vos critères de recherche */ };
        const options = { page: 1, itemsPerPage: 10, order: { /* Vos options de tri */ } };
  
        // Appelez la méthode findAll du service
        const categories = await categoryService.findAll(criteria, options);

        // Assurez-vous que le résultat est un tableau d'objets
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBeGreaterThan(0);
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
          await categoryService.create(invalidData);
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