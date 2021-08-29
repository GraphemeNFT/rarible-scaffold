// // import assert from 'assert';

// const GraphUtils = {

//     calcDna (hex) {
//         const firstHex = hex.slice(2, 10) // 8 numbers max?
//         const num = parseInt(firstHex, 16)  // eg 6016001671988620
//         const digits = num.toString().split('').slice(0, 8) // first 8 digits
//         const dna = digits.map(digit => parseInt(digit))
//         const result = { hex, dna, firstHex, digits }
//         console.log('calcDna', firstHex, dna)
//         return result
//     }

// }

// export default GraphUtils


// // function test () {
// //     const hex = '0x3d59577d74920f338b379dedbb52b9a396f9b9fd6f555be096dda1a8b0049820'
// //     const res = GraphUtils.calcDna(hex)

// //     const dna = [
// //         6, 4, 3, 2,
// //         9, 0, 7, 9
// //     ]

// //     assert.equal(res.hex, hex)
// //     assert.equal(res.dna, dna)
// //     console.log(res)
// // }

// // if (require.main === module) {
// //     test();
// // }

