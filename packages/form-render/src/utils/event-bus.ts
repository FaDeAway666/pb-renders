class EventBus {
  // 存储事件和回调的映射
  private events: Map<string, Set<(...args: any[]) => void>>;
  private static instance: EventBus;

  // 私有构造函数，防止外部直接实例化
  private constructor() {
    this.events = new Map();
  }

  // 获取单例实例
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public getEvents(): Map<string, Set<(...args: any[]) => void>> {
    return this.events;
  }

  // 订阅事件
  public subscribe(target: string, callback: (...args: any[]) => void): void {
    if (!this.events.has(target)) {
      const set = new Set<(...args: any[]) => void>();
      set.add(callback);
      this.events.set(target, set);
    } else {
      this.events.get(target)?.add(callback);
    }
  }

  // 取消订阅事件
  public unsubscribe(target: string): void {
    const callbacks = this.events.get(target);
    if (callbacks) {
      this.events.delete(target);
    }
  }

  // 发布事件
  public publish(target: string, ...args: any[]): void {
    const callbacks = this.events.get(target);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(...args);
      }
    }
  }
}

export default EventBus;
