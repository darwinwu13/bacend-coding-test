const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');
const { expect } = require('chai');
const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

function generateRides(number) {
  context('Generate Rides', () => {
    for (let i = 1; i <= number; i += 1) {
      it('should return status code 200 with ride object', (done) => {
        const req = {
          start_lat: 50,
          start_long: 100,
          end_lat: 50,
          end_long: 100,
          rider_name: `Darwin${i}`,
          driver_name: `Driver A${i}`,
          driver_vehicle: 'Yamaha N-Max',
        };

        request(app)
          .post('/rides')
          .send(req)
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });
    }
  });
}

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      return done();
    });
  });

  it('should disabled etag', () => {
    const isDisabled = app.disabled('etag');
    expect(isDisabled).to.equals(true);
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });

  describe('When database is empty ', () => {
    context('GET /rides', () => {
      it('should return status code 404', (done) => {
        request(app)
          .get('/rides')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .expect({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          }, done);
      });
    });

    context('GET /rides?page=1', () => {
      it('should return status code 404', (done) => {
        request(app)
          .get('/rides?page=1')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .expect({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          }, done);
      });
    });

    context('GET /rides/1', () => {
      it('should return status code 404', (done) => {
        request(app)
          .get('/rides/1')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .expect({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          }, done);
      });
    });
  });

  describe('POST /rides', () => {
    context('without request parameter start latitude and start longitude', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({})
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
          }, done);
      });
    });

    context('with request parameter start latitude [-90 - 90] and start longitude [-180 - 180]', () => {
      context('with start latitude -100 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({ start_lat: -100 })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with start latitude 100 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({ start_lat: 100 })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with start longitude -200 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_long: -200,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with start longitude 200 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_long: 200,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with start latitude 80, but no start longitude ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 80,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with start longitude 100, but no start latitude ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_long: 100,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with start latitude 50 and start longitude 100, but no other parameters ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });
    });

    context('without request parameter end latitude and end longitude', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({
            start_lat: 50,
            start_long: 100,
          })
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
          }, done);
      });
    });

    context('with request parameter end latitude [-90 - 90] and end longitude [-180 - 180]', () => {
      context('with end latitude -100 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_lat: -100,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with end latitude 100 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_lat: 100,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with end longitude -200 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_long: -200,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with end longitude 200 ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_long: 200,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with end latitude 80, but no end longitude ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_lat: 80,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with end longitude 100, but no end latitude ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_long: 100,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
            }, done);
        });
      });

      context('with end latitude 50 and end longitude 100, but no other parameters ', () => {
        it('should return validation error with status code 422', (done) => {
          request(app)
            .post('/rides')
            .send({
              start_lat: 50,
              start_long: 100,
              end_lat: 50,
              end_long: 100,
            })
            .expect('Content-Type', /application\/json/)
            .expect(422)
            .expect({
              error_code: 'VALIDATION_ERROR',
              message: 'Rider name must be a non empty string',
            }, done);
        });
      });
    });

    context('without request parameter rider name', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({
            start_lat: 50,
            start_long: 100,
            end_lat: 50,
            end_long: 100,
          })
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string',
          }, done);
      });
    });

    context('with request parameter rider name', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({
            start_lat: 50,
            start_long: 100,
            end_lat: 50,
            end_long: 100,
            rider_name: 'Darwin',
          })
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver name must be a non empty string',
          }, done);
      });
    });

    context('without request parameter driver name', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({
            start_lat: 50,
            start_long: 100,
            end_lat: 50,
            end_long: 100,
            rider_name: 'Darwin',
          })
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver name must be a non empty string',
          }, done);
      });
    });

    context('with request parameter driver name', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({
            start_lat: 50,
            start_long: 100,
            end_lat: 50,
            end_long: 100,
            rider_name: 'Darwin',
            driver_name: 'Driver A',
          })
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver Vehicle must be a non empty string',
          }, done);
      });
    });

    context('without request parameter driver vehicle', () => {
      it('should return validation error with status code 422', (done) => {
        request(app)
          .post('/rides')
          .send({
            start_lat: 50,
            start_long: 100,
            end_lat: 50,
            end_long: 100,
            rider_name: 'Darwin',
            driver_name: 'Driver A',
          })
          .expect('Content-Type', /application\/json/)
          .expect(422)
          .expect({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver Vehicle must be a non empty string',
          }, done);
      });
    });

    context('with all request parameter', () => {
      it('should return status code 200 with ride object', (done) => {
        const req = {
          start_lat: 50,
          start_long: 100,
          end_lat: 50,
          end_long: 100,
          rider_name: 'Darwin',
          driver_name: 'Driver A',
          driver_vehicle: 'Yamaha N-Max',
        };

        request(app)
          .post('/rides')
          .send(req)
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });
    });
  });

  describe('When database is not empty', () => {
    context('GET /rides', () => {
      it('should return status code 200', (done) => {
        request(app)
          .get('/rides')
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });
    });
    context('GET /rides/1', () => {
      it('should return status code 200', (done) => {
        request(app)
          .get('/rides/1')
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });
    });

    context('when there are more than 20 data in database', () => {
      generateRides(20);
      context('GET /rides?page=1', () => {
        it('should return status code 200', (done) => {
          request(app)
            .get('/rides?page=1')
            .expect('Content-Type', /application\/json/)
            .expect(200, done);
        });
      });
      context('GET /rides?page=2', () => {
        it('should return status code 200', (done) => {
          request(app)
            .get('/rides?page=2')
            .expect('Content-Type', /application\/json/)
            .expect(200, done);
        });
      });
      context('GET /rides?page=4 when data is no more than 30', () => {
        it('should return status code 404', (done) => {
          request(app)
            .get('/rides?page=4')
            .expect('Content-Type', /application\/json/)
            .expect(404, done);
        });
      });
    });
  });
});
