const db = require('../config/database');

class NominationModel {
  static async create(nominationData) {
    const {
      name,
      course,
      phone_no,
      domain,
      email,
      insta_id,
      github_id,
      gender
    } = nominationData;

    const query = `
      INSERT INTO nominations (
        name, course, phone_no, domain, email, insta_id, github_id, gender
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      name,
      course,
      phone_no,
      domain,
      email,
      insta_id || null,
      github_id || null,
      gender
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM nominations';
    const dataQuery = `
      SELECT * FROM nominations 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

    try {
      const countResult = await db.query(countQuery);
      const dataResult = await db.query(dataQuery, [limit, offset]);
      
      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      return {
        nominations: dataResult.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM nominations WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByEmail(email) {
    const query = 'SELECT * FROM nominations WHERE email = $1';
    
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE nominations 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM nominations WHERE id = $1 RETURNING *';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByDomain(domain, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM nominations WHERE domain = $1';
    const dataQuery = `
      SELECT * FROM nominations 
      WHERE domain = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    try {
      const countResult = await db.query(countQuery, [domain]);
      const dataResult = await db.query(dataQuery, [domain, limit, offset]);
      
      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      return {
        nominations: dataResult.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_nominations,
        COUNT(CASE WHEN domain = 'Sponsorship & Marketing' THEN 1 END) as sponsorship_marketing,
        COUNT(CASE WHEN domain = 'Social Media Team' THEN 1 END) as social_media,
        COUNT(CASE WHEN domain = 'UI/UX' THEN 1 END) as ui_ux,
        COUNT(CASE WHEN domain = 'App Dev' THEN 1 END) as app_dev,
        COUNT(CASE WHEN domain = 'Web Dev' THEN 1 END) as web_dev,
        COUNT(CASE WHEN domain = 'Cybersecurity Team' THEN 1 END) as cybersecurity,
        COUNT(CASE WHEN gender = 'Male' THEN 1 END) as male_count,
        COUNT(CASE WHEN gender = 'Female' THEN 1 END) as female_count,
        COUNT(CASE WHEN gender = 'Others' THEN 1 END) as others_count
      FROM nominations
    `;

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NominationModel;
