import trainerRepo from './repositories/trainer.repo.js';

async function testTrainerData() {
  try {
    console.log('Testing trainer data...');
    const trainers = await trainerRepo.findAll();
    console.log('Trainers data:');
    console.log(JSON.stringify(trainers, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

testTrainerData();