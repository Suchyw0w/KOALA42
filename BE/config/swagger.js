const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Characters API',
      version: '1.0.0',
      description: 'A REST API for managing characters, nemeses, and secrets with tree-structured responses and statistics',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'DEV'
      }
    ],
    components: {
      schemas: {
        Character: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier'
            },
            name: {
              type: 'string',
              description: 'Character name'
            },
            gender: {
              type: 'string',
              description: 'Character gender'
            },
            ability: {
              type: 'string',
              description: 'Character ability'
            },
            minimal_distance: {
              type: 'string',
              description: 'Minimal distance'
            },
            weight: {
              type: 'integer',
              description: 'Character weight'
            },
            born: {
              type: 'string',
              description: 'Birth date'
            },
            in_space_since: {
              type: 'string',
              description: 'Date when character went to space'
            },
            beer_consumption: {
              type: 'integer',
              description: 'Amount of beer consumed'
            },
            knows_the_answer: {
              type: 'boolean',
              description: 'Whether character knows the answer (to life, universe and everything)'
            }
          }
        },
        Nemesis: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier'
            },
            character_id: {
              type: 'integer',
              description: 'ID of the character this nemesis belongs to'
            },
            is_alive: {
              type: 'boolean',
              description: 'If the nemesis is alive'
            },
            years: {
              type: 'integer',
              description: 'Age of the nemesis'
            }
          }
        },
        Secret: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier'
            },
            nemesis_id: {
              type: 'integer',
              description: 'ID of the nemesis this secret belongs to'
            },
            secret_code: {
              type: 'integer',
              description: 'Secret code'
            }
          }
        },
        CharacterTreeResponse: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/Character'
            },
            children: {
              type: 'object',
              properties: {
                has_nemesis: {
                  type: 'object',
                  properties: {
                    records: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          data: {
                            $ref: '#/components/schemas/Nemesis'
                          },
                          children: {
                            type: 'object',
                            properties: {
                              has_secret: {
                                type: 'object',
                                properties: {
                                  records: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      properties: {
                                        data: {
                                          $ref: '#/components/schemas/Secret'
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        StatisticsResponse: {
          type: 'object',
          properties: {
            characters_count: {
              type: 'integer',
              description: 'Total number of characters'
            },
            average_age: {
              type: 'integer',
              description: 'Average age of all characters and nemeses'
            },
            average_weight: {
              type: 'integer',
              description: 'Average weight of all characters'
            },
            genders: {
              type: 'object',
              properties: {
                female: {
                  type: 'integer',
                  description: 'Number of female characters'
                },
                male: {
                  type: 'integer',
                  description: 'Number of male characters'
                },
                other: {
                  type: 'integer',
                  description: 'Number of other gender characters'
                }
              }
            },
            characters: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CharacterTreeResponse'
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'API is running'
            }
          }
        }
      }
    }
  },
  apis: ['./controllers/*.js', './routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };