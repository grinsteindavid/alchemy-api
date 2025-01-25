import os from 'os';

export async function getSystemStats() {
  // Get total and free memory
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

  // Function to calculate CPU usage
  function calculateCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    return {
      idle: totalIdle / cpus.length,
      total: totalTick / cpus.length,
    };
  }

  // Measure CPU usage at two different times with a delay
  const startMeasure = calculateCpuUsage();

  // Introduce a delay to allow for CPU usage measurement
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return delay(100).then(() => {
    const endMeasure = calculateCpuUsage();

    const idleDifference = endMeasure.idle - startMeasure.idle;
    const totalDifference = endMeasure.total - startMeasure.total;

    // Check for zero totalDifference to avoid division by zero
    const cpuUsagePercentage = totalDifference > 0 ? ((totalDifference - idleDifference) / totalDifference) * 100 : 0;

    return {
      memoryUsagePercentage: memoryUsagePercentage.toFixed(2),
      cpuUsagePercentage: cpuUsagePercentage.toFixed(2),
    };
  });
}