// export something
const msg = 'Hello World';

// default export (we only have 1 chance to do this)
const location = 'Juarez';

const getGreeting = (name) => {
    return `Welcome to the course ${name}.`
};

export { msg, getGreeting, location as default };