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
  validSquare = [];

  constructor(size, input, dict) {
    this.size = parseInt(size);
    this.input = input;
    this.dict = this.filterPotentialWords(dict);
  }

  generate() {
    this.findWords(this.validSquare, 0, this.input);
  }

  findWords(wordSquare, row, filteredInput) {
    if (!filteredInput) {
      this.validSquare = wordSquare;
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
        const nextFilteredInput = this.removeCharsFromInput(
          filteredInput,
          word,
        );

        if (this.findWords(nextSquare, row + 1, nextFilteredInput)) {
          return true;
        } else {
          // Continue checking posssible words on this "level".
        }
      }
    }
    return false;
  }

  updatePrefix(wordSquare, row) {
    let prefix = "";
    for (let r = 0; r < wordSquare.length; r++) {
      prefix += wordSquare[r][row];
    }
    return prefix;
  }

  removeCharsFromInput(chars, word) {
    const tempCharsArr = chars.split("");

    for (const char of word) {
      if (chars.includes(char)) {
        tempCharsArr.splice(tempCharsArr.indexOf(char), 1);
      }
    }

    return tempCharsArr.join("");
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

  print(wordSquare) {
    wordSquare.forEach((word) => {
      console.log(word);
    });
  }

  printValidSquare() {
    this.print(this.validSquare);
  }
}

function main([size, input]) {
  const dict = new Dictionary();
  const words = dict.fromFile("dictionary.txt");

  const wordSquare = new WordSquare(size, input, words);
  // wordSquare.buildGrid();
  wordSquare.generate();
  wordSquare.printValidSquare();
}

if (process.argv.length > 4) {
  console.error(
    "The program accepts 2 arguements. The first should be the size of the square. The second should be the characters that fill it.",
  );
  console.log("e.g. 4 eeeeddoonnnsssrv");
} else {
  main(process.argv.slice(2));
}
