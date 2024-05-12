interface Task {
    key: string;
    dependencies: string[];
    duration: number;
}

class TaskScheduler {
    tasks: Task[];
    scheduledTasks: string[];

    constructor() {
        this.tasks = [];
        this.scheduledTasks = [];
    }
    
    addTask = (task: string, dependencies: string[] = [], duration: number = 1) => {
        this.validateTask(task);
        this.tasks.push({ key: task, dependencies, duration });
    }

    scheduleTasks(): string[] {
        const scheduledTasks: string[] = [];
        const visited: string[] = [];

        const schedule = (task: string): void => {
            const found = visited.indexOf(task);

            if (found === -1) {
                visited.push(task);

                const taskItem = this.tasks.filter(item => item.key === task).pop();
                if (taskItem) {
                    const { dependencies, duration } = taskItem;
                    dependencies.forEach(dep => schedule(dep));

                    scheduledTasks.push(this.prepareTask(task, scheduledTasks.length, duration));
                }
            }
        };

        this.tasks.forEach(task => schedule(task.key));

        return scheduledTasks;
    }

    validateTask = (task: string) => {
        if (this.tasks.some(element => element.key === task)) {
            throw new Error(`Task ${task} already exists!`);
        }
    }

    prepareTask = (key: string, startsAt: number, duration: number): string => {
        return `Task: ${key}, starts at ${startsAt}, for ${duration}`;
    }
}

// Test
const scheduler = new TaskScheduler();
scheduler.addTask("A");
scheduler.addTask("B", ["A"]);
scheduler.addTask("C", ["A"]);
scheduler.addTask("D", ["B", "C"]);
scheduler.addTask("E", ["D"]);

// Adding a task with a circular dependency (uncomment to test)
// scheduler.addTask("F", ["F"]);

const scheduledTasks = scheduler.scheduleTasks();
console.log("Scheduled Tasks:", scheduledTasks);
