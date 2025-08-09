const NominationModel = require('../models/Nomination');
const { validateNomination } = require('../validators/nominationValidator');

class NominationController {
  // Create a new nomination
  static async createNomination(req, res) {
    try {
      const { error, value } = validateNomination(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Check if email already exists
      const existingNomination = await NominationModel.getByEmail(value.email);
      if (existingNomination) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists. Each person can only submit one nomination.'
        });
      }

      const nomination = await NominationModel.create(value);
      
      res.status(201).json({
        success: true,
        message: 'Nomination submitted successfully',
        data: nomination
      });
    } catch (error) {
      console.error('Error creating nomination:', error);
      
      if (error.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all nominations with pagination
  static async getAllNominations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters'
        });
      }

      const result = await NominationModel.getAll(page, limit);
      
      res.status(200).json({
        success: true,
        message: 'Nominations retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting nominations:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get nomination by ID
  static async getNominationById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid nomination ID'
        });
      }

      const nomination = await NominationModel.getById(id);
      
      if (!nomination) {
        return res.status(404).json({
          success: false,
          message: 'Nomination not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Nomination retrieved successfully',
        data: nomination
      });
    } catch (error) {
      console.error('Error getting nomination by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update nomination
  static async updateNomination(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid nomination ID'
        });
      }

      const { error, value } = validateNomination(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Check if nomination exists
      const existingNomination = await NominationModel.getById(id);
      if (!existingNomination) {
        return res.status(404).json({
          success: false,
          message: 'Nomination not found'
        });
      }

      // Check if email is being changed and if it already exists
      if (value.email !== existingNomination.email) {
        const emailExists = await NominationModel.getByEmail(value.email);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      const updatedNomination = await NominationModel.update(id, value);
      
      res.status(200).json({
        success: true,
        message: 'Nomination updated successfully',
        data: updatedNomination
      });
    } catch (error) {
      console.error('Error updating nomination:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete nomination
  static async deleteNomination(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid nomination ID'
        });
      }

      const deletedNomination = await NominationModel.delete(id);
      
      if (!deletedNomination) {
        return res.status(404).json({
          success: false,
          message: 'Nomination not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Nomination deleted successfully',
        data: deletedNomination
      });
    } catch (error) {
      console.error('Error deleting nomination:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get nominations by domain
  static async getNominationsByDomain(req, res) {
    try {
      const { domain } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const validDomains = [
        'Sponsorship & Marketing',
        'Social Media Team',
        'UI/UX',
        'App Dev',
        'Web Dev',
        'Cybersecurity Team'
      ];

      if (!validDomains.includes(domain)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid domain'
        });
      }

      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters'
        });
      }

      const result = await NominationModel.getByDomain(domain, page, limit);
      
      res.status(200).json({
        success: true,
        message: `Nominations for ${domain} retrieved successfully`,
        data: result
      });
    } catch (error) {
      console.error('Error getting nominations by domain:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get nomination statistics
  static async getNominationStats(req, res) {
    try {
      const stats = await NominationModel.getStats();
      
      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting nomination stats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get available domains (for dropdown)
  static async getDomains(req, res) {
    try {
      const domains = [
        'Sponsorship & Marketing',
        'Social Media Team',
        'UI/UX',
        'App Dev',
        'Web Dev',
        'Cybersecurity Team'
      ];

      res.status(200).json({
        success: true,
        message: 'Domains retrieved successfully',
        data: domains
      });
    } catch (error) {
      console.error('Error getting domains:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = NominationController;
