import * as v from 'valibot'

export const PetSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  type: v.union([v.literal('cat'), v.literal('dog')]),
})

export const NewPetSchema = v.omit(PetSchema, ['id'])

export const UserSchema = v.object({
  id: v.string(),
  name: v.string(),
  age: v.pipe(v.number(), v.minValue(18)),
  disabled: v.boolean(),
  pets: v.nullish(v.array(PetSchema)),
})

export const NewUserSchema = v.omit(UserSchema, ['id'])
