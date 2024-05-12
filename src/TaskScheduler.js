var TaskScheduler = /** @class */ (function () {
    function TaskScheduler() {
        var _this = this;
        this.addTask = function (task, dependencies, duration) {
            if (dependencies === void 0) { dependencies = []; }
            if (duration === void 0) { duration = 1; }
            _this.validateTask(task);
            _this.tasks.push({ key: task, dependencies: dependencies, duration: duration });
        };
        this.validateTask = function (task) {
            if (_this.tasks.some(function (element) { return element.key === task; })) {
                throw new Error("Task ".concat(task, " already exists!"));
            }
        };
        this.prepareTask = function (key, startsAt, duration) {
            return "Task: ".concat(key, ", starts at ").concat(startsAt, ", for ").concat(duration);
        };
        this.tasks = [];
        this.scheduledTasks = [];
    }
    TaskScheduler.prototype.scheduleTasks = function () {
        var _this = this;
        var scheduledTasks = [];
        var visited = [];
        var schedule = function (task) {
            var found = visited.indexOf(task);
            if (found === -1) {
                visited.push(task);
                var taskItem = _this.tasks.filter(function (item) { return item.key === task; }).pop();
                if (taskItem) {
                    var dependencies = taskItem.dependencies, duration = taskItem.duration;
                    dependencies.forEach(function (dep) { return schedule(dep); });
                    scheduledTasks.push(_this.prepareTask(task, scheduledTasks.length, duration));
                }
            }
        };
        this.tasks.forEach(function (task) { return schedule(task.key); });
        return scheduledTasks;
    };
    return TaskScheduler;
}());
// Test
var scheduler = new TaskScheduler();
scheduler.addTask("A");
scheduler.addTask("B", ["A"]);
scheduler.addTask("C", ["A"]);
scheduler.addTask("D", ["B", "C"]);
scheduler.addTask("E", ["D"]);
// Adding a task with a circular dependency (uncomment to test)
// scheduler.addTask("F", ["F"]);
var scheduledTasks = scheduler.scheduleTasks();
console.log("Scheduled Tasks:", scheduledTasks);
