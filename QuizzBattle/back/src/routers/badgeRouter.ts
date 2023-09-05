import express from 'express';

import GenericController from '../controllers/genericController';
import BadgeService from '../services/badgeService';

const badgeServiceInstance = new BadgeService();
const badgeController = GenericController(badgeServiceInstance);

const badgeRouter = express.Router();

badgeRouter.post('/', badgeController.create);
badgeRouter.get('/:userId', badgeController.getAllBy);
badgeRouter.post('/success/add', badgeController.addTenWinningGamesBadgeToUser);


export default badgeRouter;
