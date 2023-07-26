import CategoryService from "../services/categoryService";
import { test, expect } from '@jest/globals';
const { Category } = require('../models');

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
  
        // Assurez-vous que chaque élément du tableau est bien une instance de Category
        categories.forEach(category => {
          expect(category instanceof Category).toBe(true);
        });
      });
    });
  
    // Test pour la méthode create
    describe('create', () => {
      it('should create a new category', async () => {
        // Vous pouvez remplacer les données selon vos besoins de test
        const newData = { /* Vos données pour la création d'une nouvelle catégorie */ };
  
        // Appelez la méthode create du service
        const category = await categoryService.create(newData);
  
        // Assurez-vous que le résultat est une instance de Category
        expect(category instanceof Category).toBe(true);
        // Assurez-vous que les propriétés de la nouvelle catégorie sont correctement définies
        expect(category.name).toBe(newData.name);
        // Vérifiez d'autres propriétés si nécessaire
      });
  
      it('should throw an error if validation fails', async () => {
        // Vous pouvez remplacer les données selon vos besoins de test
        const invalidData = { /* Des données invalides pour provoquer une erreur de validation */ };
  
        // Appelez la méthode create du service avec des données invalides
        try {
          await categoryService.create(invalidData);
          // Si la promesse n'est pas rejetée, le test échouera car une erreur de validation était attendue
          expect(true).toBe(false);
        } catch (error) {
          // Vérifiez que l'erreur est bien une erreur de validation
          expect(error.name).toBe('ValidationError');
          // Vérifiez d'autres propriétés de l'erreur si nécessaire
        }
      });
    });
});