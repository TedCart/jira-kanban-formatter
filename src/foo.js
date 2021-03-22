export const thingOne = "Foo"
const thingTwo = "Poo"

export { runAway, jumpUp }

function runAway (string) {
  const res = `${string} is scary - let's run away!`
  console.log(res)
} // end of runAway

function jumpUp (num) {
  const res = `let's jump us at least ${num} feet!`
  console.log(res)
} // end of jumpUp
