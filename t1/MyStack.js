class MyStack{
    constructor(){
        this.items = new Array();
    }

    push(element) {
        this.items.push(element);
    }

    pop() { 
        if (this.items.length == 0) 
            return false; 
        return this.items.pop(); 
    } 

    top(){
        return this.items[this.items.length - 1]; 
    }

    isEmpty() {
        return this.items.length == 0; 
    }
}