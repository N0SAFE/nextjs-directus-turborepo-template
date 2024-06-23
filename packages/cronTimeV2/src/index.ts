import { CronTime } from "cron-time-generator";
export class CronTimeV2 extends CronTime {
  static everySecond() {
    return "* * * * * *";
  }
  static everyTwoSeconds() {
    return "*/2 * * * * *";
  }
  static everyThreeSeconds() {
    return "*/3 * * * * *";
  }
  static everyFourSeconds() {
    return "*/4 * * * * *";
  }
  static everyFiveSeconds() {
    return "*/5 * * * * *";
  }
  static everyTenSeconds() {
    return "*/10 * * * * *";
  }
  static everyFifteenSeconds() {
    return "*/15 * * * * *";
  }
  static everyThirtySeconds() {
    return "*/30 * * * * *";
  }
  static everyMinute() {
    return "* * * * *";
  }
  static everyTwoMinutes() {
    return "*/2 * * * *";
  }
  static everyThreeMinutes() {
    return "*/3 * * * *";
  }
  static everyFourMinutes() {
    return "*/4 * * * *";
  }
  static everyFiveMinutes() {
    return "*/5 * * * *";
  }
  static everyTenMinutes() {
    return "*/10 * * * *";
  }
  static everyFifteenMinutes() {
    return "*/15 * * * *";
  }
  static everyThirtyMinutes() {
    return "*/30 * * * *";
  }
}
