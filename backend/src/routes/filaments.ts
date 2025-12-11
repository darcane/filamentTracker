import { Router, Request, Response } from 'express';
import { databaseService } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { CreateFilamentRequest, UpdateFilamentRequest, ReduceAmountRequest } from '../types/filament';

const router = Router();

/**
 * @swagger
 * components:
 *   responses:
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     BadRequest:
 *       description: Bad request - validation error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/filaments:
 *   get:
 *     summary: Get all filaments
 *     description: Retrieve a list of all filaments in the inventory for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of filaments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Filament'
 *       401:
 *         description: Not authenticated
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const filaments = await databaseService.getAllFilaments(req.user!.id);
    res.json(filaments);
  } catch (error) {
    console.error('Error fetching filaments:', error);
    res.status(500).json({ error: 'Failed to fetch filaments' });
  }
});

/**
 * @swagger
 * /api/filaments/{id}:
 *   get:
 *     summary: Get filament by ID
 *     description: Retrieve a specific filament by its unique identifier for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the filament
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Filament retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filament'
 *       401:
 *         description: Not authenticated
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const filament = await databaseService.getFilamentById(id, req.user!.id);
    
    if (!filament) {
      return res.status(404).json({ error: 'Filament not found' });
    }
    
    res.json(filament);
  } catch (error) {
    console.error('Error fetching filament:', error);
    res.status(500).json({ error: 'Failed to fetch filament' });
  }
});

/**
 * @swagger
 * /api/filaments:
 *   post:
 *     summary: Create new filament
 *     description: Add a new filament to the inventory for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFilamentRequest'
 *           example:
 *             brand: "Bambu Lab"
 *             filamentType: "PETG"
 *             typeModifier: "CF - Carbon Fiber"
 *             color: "Gray"
 *             amount: 1000
 *             cost: 165.50
 *             currency: "SEK"
 *     responses:
 *       201:
 *         description: Filament created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filament'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Not authenticated
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const filamentData: CreateFilamentRequest = req.body;
    
    // Basic validation
    if (!filamentData.brand || !filamentData.filamentType || !filamentData.color) {
      return res.status(400).json({ error: 'Missing required fields: brand, filamentType, color' });
    }
    
    if (typeof filamentData.amount !== 'number' || filamentData.amount < 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    if (typeof filamentData.cost !== 'number' || filamentData.cost < 0) {
      return res.status(400).json({ error: 'Cost must be a positive number' });
    }
    
    if (!['SEK', 'EUR', 'USD'].includes(filamentData.currency)) {
      return res.status(400).json({ error: 'Currency must be SEK, EUR, or USD' });
    }

    const newFilament = await databaseService.createFilament({
      ...filamentData,
      userId: req.user!.id,
    });
    res.status(201).json(newFilament);
  } catch (error) {
    console.error('Error creating filament:', error);
    res.status(500).json({ error: 'Failed to create filament' });
  }
});

/**
 * @swagger
 * /api/filaments/{id}:
 *   put:
 *     summary: Update filament
 *     description: Update an existing filament in the inventory for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the filament
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFilamentRequest'
 *           example:
 *             brand: "Bambu Lab"
 *             amount: 950
 *             cost: 160.00
 *     responses:
 *       200:
 *         description: Filament updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filament'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Not authenticated
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateFilamentRequest = req.body;
    
    // Validate amount if provided
    if (updates.amount !== undefined && (typeof updates.amount !== 'number' || updates.amount < 0)) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    
    // Validate cost if provided
    if (updates.cost !== undefined && (typeof updates.cost !== 'number' || updates.cost < 0)) {
      return res.status(400).json({ error: 'Cost must be a positive number' });
    }
    
    // Validate currency if provided
    if (updates.currency && !['SEK', 'EUR', 'USD'].includes(updates.currency)) {
      return res.status(400).json({ error: 'Currency must be SEK, EUR, or USD' });
    }

    const updatedFilament = await databaseService.updateFilament(id, req.user!.id, updates);
    
    if (!updatedFilament) {
      return res.status(404).json({ error: 'Filament not found' });
    }
    
    res.json(updatedFilament);
  } catch (error) {
    console.error('Error updating filament:', error);
    res.status(500).json({ error: 'Failed to update filament' });
  }
});

/**
 * @swagger
 * /api/filaments/{id}:
 *   delete:
 *     summary: Delete filament
 *     description: Remove a filament from the inventory for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the filament
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: Filament deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await databaseService.deleteFilament(id, req.user!.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Filament not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting filament:', error);
    res.status(500).json({ error: 'Failed to delete filament' });
  }
});

/**
 * @swagger
 * /api/filaments/{id}/reduce:
 *   patch:
 *     summary: Reduce filament amount
 *     description: Reduce the amount of a filament for the authenticated user (for Home Assistant integration)
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the filament
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReduceAmountRequest'
 *           example:
 *             amount: 50
 *     responses:
 *       200:
 *         description: Filament amount reduced successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filament'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Not authenticated
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch('/:id/reduce', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount }: ReduceAmountRequest = req.body;
    
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const updatedFilament = await databaseService.reduceFilamentAmount(id, req.user!.id, amount);
    
    if (!updatedFilament) {
      return res.status(404).json({ error: 'Filament not found' });
    }
    
    res.json(updatedFilament);
  } catch (error) {
    console.error('Error reducing filament amount:', error);
    res.status(500).json({ error: 'Failed to reduce filament amount' });
  }
});

/**
 * @swagger
 * /api/filaments/stats/total:
 *   get:
 *     summary: Get total filament count
 *     description: Get the total number of filaments in the inventory for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Total count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 25
 *       401:
 *         description: Not authenticated
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/stats/total', authenticateToken, async (req: Request, res: Response) => {
  try {
    const total = await databaseService.getTotalFilaments(req.user!.id);
    res.json({ total });
  } catch (error) {
    console.error('Error fetching total count:', error);
    res.status(500).json({ error: 'Failed to fetch total count' });
  }
});

/**
 * @swagger
 * /api/filaments/stats/value:
 *   get:
 *     summary: Get total inventory value by currency
 *     description: Get the total value of all filaments grouped by currency for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Total value retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   currency:
 *                     type: string
 *                     example: "SEK"
 *                   total:
 *                     type: number
 *                     example: 1650.50
 *       401:
 *         description: Not authenticated
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/stats/value', authenticateToken, async (req: Request, res: Response) => {
  try {
    const value = await databaseService.getTotalValue(req.user!.id);
    res.json(value);
  } catch (error) {
    console.error('Error fetching total value:', error);
    res.status(500).json({ error: 'Failed to fetch total value' });
  }
});

/**
 * @swagger
 * /api/filaments/stats/brands:
 *   get:
 *     summary: Get brand statistics
 *     description: Get the count of filaments grouped by brand for the authenticated user
 *     tags: [Filaments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Brand statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   brand:
 *                     type: string
 *                     example: "Bambu Lab"
 *                   count:
 *                     type: number
 *                     example: 5
 *       401:
 *         description: Not authenticated
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/stats/brands', authenticateToken, async (req: Request, res: Response) => {
  try {
    const brands = await databaseService.getBrandStats(req.user!.id);
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brand stats:', error);
    res.status(500).json({ error: 'Failed to fetch brand statistics' });
  }
});

export default router;
