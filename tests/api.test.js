const request = require('supertest');

const { expect } = require('chai');
const Application = require('../src/app');
const RideModel = require('../src/model/ride');

class TestApplication {
  init() {
    this.application = new Application();
    this.httpApp = this.application.app;
  }

  runTest() {
    describe('Ride Model Tests', () => {
      describe('#connect()', () => {
        const ride = new RideModel();
        it('rideModel.db should\'t be undefined', async () => {
          await ride.connect();
          expect(ride.db).to.not.equal(undefined);
        });
      });

      describe('#startNewRide()', () => {
        const ride = new RideModel();
        context('when arguments is not valid', () => {
          it('should throw an error', async () => {
            let errThrown = false;
            try {
              const values = [
                0, 0, 0, 0,
              ];
              await ride.startNewRide(values);
            } catch (e) {
              errThrown = true;
            }
            if (!errThrown) throw Error('Invalid logic constraint on #startNewRide()');
          });
        });
        context('when arguments is  valid', () => {
          it('should return an result object with lastID', async () => {
            const values = [
              0, 0, 0, 0, 'a', 'a', 'a',
            ];
            const result = await ride.startNewRide(values);
            expect(result.lastID).to.not.equal(undefined);
          });
        });
      });

      describe('#findById()', () => {
        const ride = new RideModel();
        let cachedRide;
        before(async () => {
          cachedRide = await TestApplication.generateSingleRide(ride);
        });
        context('when there is no arguments', () => {
          it('should return an empty array', async () => {
            const res = await ride.findById();
            expect(res).to.eql([]);
          });
        });
        context('when the argument value is not found', () => {
          it('should return an empty array', async () => {
            const res = await ride.findById(100);
            expect(res).to.eql([]);
          });
        });
        context('when the argument value is found', () => {
          it('should return an empty array', async () => {
            const res = await ride.findById(1);
            expect(res).to.eql(cachedRide);
          });
        });
      });
      describe('#paginate()', () => {
        const ride = new RideModel();
        let cachedRide;
        before(async () => {
          cachedRide = await TestApplication.generateSingleRide(ride);
          await TestApplication.generateRides(ride, 20);
        });

        context('#paginate', () => {
          context('when there is no argument', () => {
            it('should contains cached ride object', async () => {
              const res = await ride.paginate();
              expect(res).to.deep.include(cachedRide[0]);
            });
          });
          context('when the pageInput value is string', () => {
            it('should contains cached ride object', async () => {
              const res = await ride.paginate('a');
              expect(res).to.deep.include(cachedRide[0]);
            });
          });
          context('when the pageInput value is 1', () => {
            it('should return array of object with length 10', async () => {
              const res = await ride.paginate(1);
              expect(res.length).to.equal(10);
              expect(res).to.deep.include(cachedRide[0]);
            });
          });
          context('when the pageInput value is 2', () => {
            it('should return array of object with length 10, and different data from page 1', async () => {
              const res = await ride.paginate(2);
              expect(res.length).to.equal(10);
              expect(res).to.not.deep.include(cachedRide[0]);
            });
          });
          context('when the pageInput value is 4', () => {
            it('should', async () => {
              const res = await ride.paginate(4);
              expect(res).to.eql([]);
            });
          });
        });
      });
    });

    describe('API tests', () => {
      before(() => this.init());
      it('should disabled etag', () => {
        const isDisabled = this.httpApp.disabled('etag');
        expect(isDisabled).to.equals(true);
      });

      describe('GET /health', () => {
        it('should return health', (done) => {
          request(this.httpApp)
            .get('/health')
            .expect('Content-Type', /application\/json/)
            .expect(200, done);
        });
      });

      describe('When database is empty ', () => {
        context('GET /rides', () => {
          it('should return status code 404', (done) => {
            request(this.httpApp)
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
            request(this.httpApp)
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
            request(this.httpApp)
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
            request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
            request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
              request(this.httpApp)
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
            request(this.httpApp)
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
            request(this.httpApp)
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
            request(this.httpApp)
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
            request(this.httpApp)
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
            request(this.httpApp)
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

            request(this.httpApp)
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
            request(this.httpApp)
              .get('/rides')
              .expect('Content-Type', /application\/json/)
              .expect(200, done);
          });
        });
        context('GET /rides/1', () => {
          it('should return status code 200', (done) => {
            request(this.httpApp)
              .get('/rides/1')
              .expect('Content-Type', /application\/json/)
              .expect(200, done);
          });
        });
        before(async () => TestApplication.generateRides(this.application.rideModel, 20));
        context('when there are more than 20 data in database', () => {
          context('GET /rides?page=1', () => {
            it('should return status code 200', (done) => {
              request(this.httpApp)
                .get('/rides?page=1')
                .expect('Content-Type', /application\/json/)
                .expect(200, done);
            });
          });
          context('GET /rides?page=2', () => {
            it('should return status code 200', (done) => {
              request(this.httpApp)
                .get('/rides?page=2')
                .expect('Content-Type', /application\/json/)
                .expect(200, done);
            });
          });
          context('GET /rides?page=4 when data is no more than 30', () => {
            it('should return status code 404', (done) => {
              request(this.httpApp)
                .get('/rides?page=4')
                .expect('Content-Type', /application\/json/)
                .expect(404, done);
            });
          });
        });
      });
    });
  }

  static async generateRides(rideModel, number) {
    const results = [];
    for (let i = 1; i <= number; i += 1) {
      const req = [
        50,
        100,
        50,
        100,
        `Darwin${i}`,
        `Driver${i}`,
        'Yamaha N-Max',
      ];
      results.push(rideModel.startNewRide(req));
    }
    await Promise.all(results);
  }

  static async generateSingleRide(rideModel) {
    const req = [
      50,
      100,
      50,
      100,
      'Darwin single',
      'Driver single',
      'Yamaha N-Max',
    ];
    const res = await rideModel.startNewRide(req);
    return rideModel.findById(res.lastID);
  }
}

const testApp = new TestApplication();

testApp.runTest();
