import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'

const config: Config = {
  dictionaries: [names],
}

export function getUniqueName() {
  return uniqueNamesGenerator(config)
}
