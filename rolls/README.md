# Rolls

Rolls service provides APIs for creating and updating rolls.

## Roll definition

A roll is a rectangular piece of fabric. Its main properties are: 

 - id (a random string)
 - version (a random string)
 - phisicalId (a random string)  
 - a combination of Product and Characteristic;
 - total length (in metres);
 - first class length (in metres)

A combination of `id` and `version` is a roll's `Reference`. 

A QR code of a roll is a string, containing at least both `id` and `version`. Creation of QR codes (and thus the definition of a delimeter between id and version) must not be defined in this `backend` project, but is defined in the `frontend` repo.

A roll that enters the quality department is reffered as a `source` roll. It is assigned a QR code and saved to DB. This corresponds to `createRoll` operation.

A `physicalId` is a random string, that is created during the saving of a `source` roll. All rolls that will be later created from this same piece of fabric must share the same `physicalId`. 

A new version of a source roll can be created, in case its parameters are defined more exactly or were entered incorrectly. This corresponds to `updateRoll` operation.
A new version of a roll corresponds to a new object, that has the same field `id` as an original object, but a distinct `version` field.

Then a source roll moves to quality inspection. The inspection process consists not only of inspection, but also cutting the source roll into multple new rolls. These new rolls are referred as `descendant` rolls or `cuts`. They are created using `createDescendantRoll` command.

Each descendant roll is assigned a new QR code. This QR code is not generated during the roll saving (as it is for source rolls), but read from pre-printed label. This labels are generated in advance by factory floor manager (this corresponds to `getRefsWithoutSaving` operation).

A source roll that has descendant rolls becomes a parent roll for them.

A descendant roll has a unique `id` that is not in any way related to its parent roll. To refer to its parent roll it has a distinct field `parentRoll`.

A new version of a descendant roll can be created, in case its parameters were entered incorrectly.

Physical deletion of rolls is not possible by design. Only setting the field `deletion mark` to true is possible.

## Tips and features

 - When adding new or renaming existing lambda handlers, don't forget to update `webpack.config.js`!
 - `sam build` doesn't work on this service. It doesn't support references to git repositories in `package.json`. 
 - A forked `dynamodb-toolbox` is used instead of the original package due to an existing bug. See https://github.com/jeremydaly/dynamodb-toolbox/pull/179.
 - To run tests you must have a local DynamoDB running on `localhost:8000`. Docker command to start DynamoDB: `docker run -p 8000:8000 -d amazon/dynamodb-local`