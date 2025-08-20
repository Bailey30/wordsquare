import fs from "fs";

class Dictionary {
  words = [];

  fromFile(filename) {
    this.words = fs.readFileSync(filename, "utf8").split("\r\n");
    return this.words;
  }
}

class WordSquare {
  size;
  input;
  dict;

  constructor(size, input, dict) {
    this.size = parseInt(size);
    this.input = input;
    this.dict = this.filterPotentialWords(dict);

    this.buildGrid();
  }

  buildGrid() {
    for (let i = 0; i < this.dict.length; i++) {
      let tempInput = this.input;

      const wordGrid = [];
      wordGrid.push(this.dict[i]);

      if (this.isPotentialWord(this.input, this.dict[i])) {
        tempInput = this.removeCharsFromInput(tempInput, this.dict[i]);
        this.getWord(wordGrid, 1, tempInput);
      }
    }
  }

  getWord(wordSquare, row, filteredInput) {
    if (row === this.size) {
      wordSquare.forEach((word) => {
        console.log(word);
      });
      console.log("");

      return true;
    }

    const prefix = this.updatePrefix(wordSquare, row);

    for (let i = 0; i < this.dict.length; i++) {
      const word = this.dict[i];

      if (
        this.isPotentialWord(filteredInput, word) &&
        !wordSquare.includes(word) &&
        word.startsWith(prefix)
      ) {
        const nextSquare = [...wordSquare, word];
        const nextFiltered = this.removeCharsFromInput(filteredInput, word);
        if (nextFiltered) {
          this.getWord(nextSquare, row + 1, nextFiltered);
        }
      }
    }
  }

  updatePrefix(wordSquare, row) {
    let prefix = "";
    for (let r = 0; r < wordSquare.length; r++) {
      prefix += wordSquare[r][row];
    }

    return prefix;
  }

  removeCharsFromInput(chars, word) {
    const toRemove = word.split("");
    const charsArr = chars.split("");
    for (let i = 0; i < charsArr.length; i++) {
      if (toRemove.includes(charsArr[i])) {
        charsArr.splice(i, 1);
        toRemove.splice(toRemove.indexOf(chars[i]), 1);
      }
    }

    return charsArr.join("");
  }

  filterPotentialWords(dict) {
    const potentialWords = dict
      .filter((word) => {
        return this.isPotentialWord(this.input, word);
      })
      .sort();

    return potentialWords;
  }

  /**
   * Validates whether a given word contains only the characters in the provided string
   * and is the size of square given to the class.
   */
  isPotentialWord(input, word) {
    // ^: from the first character
    // []: any character between the brackets
    // +: this found one or more times n succession (can't have other characters in between).
    // $: until the end
    const regex = new RegExp(`^[${input}]+$`);

    const potential = word.length === parseInt(this.size) && word.match(regex);
    return !!potential;
  }
}

function main([size, input]) {
  const dict = new Dictionary();
  const words = dict.fromFile("dictionary.txt");

  new WordSquare(size, input, words);
}

if (process.argv.length > 4) {
  console.error(
    "The program accepts 2 arguements. The first should be the size of the square. The second should be the characters that fill it.",
  );
  console.log("e.g. 4 eeeeddoonnnsssrv");
} else {
  main(process.argv.slice(2));
}
