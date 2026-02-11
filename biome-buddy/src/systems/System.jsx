// interface for a system
class System {
    constructor(name) {
        this.name = name
    }

    apply(context) {
        throw new Error("Method 'apply()' must be implemented in subclasses.")
    }
}

export default System