const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const listOf = (name) => ({ type: 'array', items: ref(name) });
const json = (schema, example) => ({
    'application/json': example === undefined ? { schema } : { schema, example }
});

const ok = (description, schema) => ({ description, content: json(schema) });
const created = (description, schema) => ({
    description,
    headers: { Location: { description: 'URI of the created resource.', schema: { type: 'string' } } },
    content: json(schema)
});
const noContent = { description: 'Deleted. The response has no body.' };

const error = (description, code, message, details) => ({
    description,
    content: json(ref('Error'), { error: details ? { code, message, details } : { code, message } })
});
const invalid = error(
    'The input does not satisfy the format rules.',
    'invalid_data',
    'The submitted data is not valid.',
    [{ field: 'name', message: 'Required; at most 120 characters.' }]
);
const notFound = (what, code) =>
    error(`No ${what} exists with that identifier.`, code, `No ${what} exists with that identifier.`);
const notOwned = error(
    'The user has not purchased the game.',
    'game_not_owned',
    'This operation requires having purchased the game.'
);

const pathId = (name, description) => ({
    name, in: 'path', required: true, description, schema: { type: 'integer', minimum: 1 }
});
const requestBody = (name, example) => ({ required: true, content: json(ref(name), example) });

module.exports = {
    ref, listOf, ok, created, noContent, error, invalid, notFound, notOwned, pathId, requestBody
};
