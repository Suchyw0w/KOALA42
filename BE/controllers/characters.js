const asyncHandler = require("../middlewares/asyncHandler");
const { Character, Nemesis, Secret } = require("../models/associations");

/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: Character management with statistics and tree structure responses
 */

// Calculates how old someone is based on their birth date
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // If they didn't have birthday this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Builds nested tree structure
const buildStructure = (characters) => {
  return characters.map(character => {
    // Handle all nemeses for each character
    const nemesisRecords = character.nemeses ? character.nemeses.map(nemesis => ({
      data: {
        id: nemesis.id,
        character_id: nemesis.character_id,
        is_alive: nemesis.is_alive,
        years: nemesis.years
      },
      children: {
        has_secret: {
          records: nemesis.secrets ? nemesis.secrets.map(secret => ({
            data: {
              id: secret.id,
              nemesis_id: secret.nemesis_id,
              secret_code: parseInt(secret.secret_code)
            }
          })) : []
        }
      }
    })) : [];

    // Character object with all nested data
    return {
      data: {
        id: character.id,
        name: character.name,
        gender: character.gender,
        ability: character.ability,
        minimal_distance: parseFloat(character.minimal_distance).toFixed(10),
        weight: parseInt(character.weight),
        born: character.born,
        in_space_since: character.in_space_since ? character.in_space_since : null,
        beer_consumption: character.beer_consumption,
        knows_the_answer: character.knows_the_answer
      },
      children: {
        has_nemesis: {
          records: nemesisRecords
        }
      }
    };
  });
};

// @desc    Get all characters with statistics
// @route   GET /api/v1/characters
/**
 * @swagger
 * /characters:
 *   get:
 *     summary: Get all characters with statistics and tree structure
 *     tags: [Characters]
 *     description: Returns all characters with their nemeses and secrets in a tree structure, plus statistics including character count, average age, average weight, and gender distribution.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatisticsResponse'
 *             example:
 *               characters_count: 42
 *               average_age: 42
 *               average_weight: 42
 *               genders:
 *                 female: 42
 *                 male: 42
 *                 other: 42
 *               characters:
 *                 - data:
 *                     id: 44
 *                     name: "Trillian"
 *                     gender: "female"
 *                     ability: "mathematician"
 *                     minimal_distance: "6.2000000"
 *                     weight: 49
 *                     born: "Wed Dec 14 00:00:00 CET 1994"
 *                     in_space_since: "Wed Dec 24 16:21:50 CET 2014"
 *                     beer_consumption: 6704
 *                     knows_the_answer: true
 *                   children:
 *                     has_nemesis:
 *                       records:
 *                         - data:
 *                             id: 1007
 *                             character_id: 44
 *                             is_alive: true
 *                             years: 29
 *                           children:
 *                             has_secret:
 *                               records:
 *                                 - data:
 *                                     id: 2008
 *                                     nemesis_id: 1007
 *                                     secret_code: 1799820570
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getAllCharacters = asyncHandler(async (req, res, next) => {
  try {
    // Get all characters with their nemeses and secrets from database
    // with all their nemeses and their secrets
    const characters = await Character.findAll({
      include: [
        {
          model: Nemesis,
          as: 'nemeses',
          required: false,
          include: [
            {
              model: Secret,
              as: 'secrets',
              required: false
            }
          ]
        }
      ],
      order: [['id', 'ASC']]
    });

    // Number of Characters
    const charactersCount = characters.length;
    
    // Calculate average age of characters
    // Loop through each character, calculate their age, add it up and then divide
    let totalCharacterAge = 0;
    characters.forEach(character => {
      totalCharacterAge += calculateAge(character.born);
    });

    // Calculate average weight of characters (filter out null weights)
    const charactersWithWeight = characters.filter(c => c.weight !== null);
    const totalWeight = charactersWithWeight.reduce((sum, character) => sum + parseFloat(character.weight), 0);
    const averageWeight = charactersWithWeight.length > 0 ? Math.round(totalWeight / charactersWithWeight.length) : 0;

    // Get all nemeses for average age calculation
    const allNemeses = await Nemesis.findAll();
    const nemesesWithYear = allNemeses.filter(n => n.years !== null)
    const totalNemesisAge = nemesesWithYear.reduce((sum, nemesis) => sum + nemesis.years, 0);
    
    // Calculate combined average age (characters + nemeses)
    const totalAges = totalCharacterAge + totalNemesisAge;
    const totalPeople = charactersCount + allNemeses.length;
    const averageAge = totalPeople > 0 ? Math.round(totalAges / totalPeople) : 0;

    const genders = {
      female: 0,
      male: 0,
      other: 0
    };

    characters.forEach(character => {
      if (character.gender === 'female') {
        genders.female++;
      } else if (character.gender === 'male' || character.gender === 'm' || character.gender === 'M') {
        genders.male++;
      } else {
        genders.other++;
      }
    });

    // Build tree structure
    const characterTrees = buildStructure(characters);

    // Format response as shown in the assessment example
    const response = {
      characters_count: charactersCount,
      average_age: averageAge,
      average_weight: averageWeight,
      genders,
      characters: characterTrees
    };

    // Send json response
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error:', error);
    return next(error);
  }
});

// @desc    Get character by ID
// @route   GET /api/v1/characters/:id
/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     summary: Get a specific character by ID
 *     tags: [Characters]
 *     description: Returns a single character with their nemeses and secrets in tree structure
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Character ID
 *         schema:
 *           type: integer
 *           example: 44
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CharacterTreeResponse'
 *       404:
 *         description: Character not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               error: "Character not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getCharacter = asyncHandler(async (req, res, next) => {
  // Get Character from database by ID, all his nemeses and secrets
  const character = await Character.findByPk(req.params.id, {
    include: [
      {
        model: Nemesis,
        as: 'nemeses',
        required: false,
        include: [
          {
            model: Secret,
            as: 'secrets',
            required: false
          }
        ]
      }
    ]
  });

  // If there is no character with that ID return json 
  if (!character) {
    return res.status(404).json({
      success: false,
      error: 'Character not found'
    });
  }

  const characterTree = buildStructure([character]);

  // Send json response
  res.status(200).json({
    success: true,
    data: characterTree[0]
  });
});