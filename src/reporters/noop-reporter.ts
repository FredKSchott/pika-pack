import BaseReporter from './base-reporter.js';
import {LanguageKeys} from './lang/en.js';
import {Package, ReporterSpinner, ReporterSpinnerSet, Trees} from './types.js';

export default class NoopReporter extends BaseReporter {
  lang(key: LanguageKeys, ...args: Array<any>): string {
    return 'do nothing';
  }
  verbose(msg: string) {}
  verboseInspect(val: any) {}
  initPeakMemoryCounter() {}
  checkPeakMemory() {}
  close() {}
  getTotalTime(): number {
    return 0;
  }
  list(key: string, items: Array<string>, hints?: Object) {}
  tree(key: string, obj: Trees) {}
  step(current: number, total: number, message: string, emoji?: string) {}
  error(message: string) {}
  info(message: string) {}
  warn(message: string) {}
  success(message: string) {}
  log(message: string) {}
  command(command: string) {}
  inspect(value: any) {}
  header(pkg: Package) {}
  footer(showPeakMemory: boolean) {}
  table(head: Array<string>, body: Array<Array<string>>) {}

  activity(): ReporterSpinner {
    return {
      tick(name: string) {},
      end() {},
    };
  }

  activitySet(total: number, workers: number): ReporterSpinnerSet {
    return {
      spinners: Array(workers).fill({
        clear() {},
        setPrefix() {},
        tick() {},
        end() {},
      }),
      end() {},
    };
  }

  progress(total: number): () => void {
    return function () {};
  }

  disableProgress() {
    this.noProgress = true;
  }
}
