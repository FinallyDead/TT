export { };

declare global {
  interface Mark {
    text: string
  }

  interface Account {
    id: string,
    marks: Mark[],
    type: string,
    login: string,
    password?: string,
  }

}



