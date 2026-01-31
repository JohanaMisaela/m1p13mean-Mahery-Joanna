const validate = (schema) => (req, res, next) => {
    try {
        const validated = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Replace req data with validated data only if they exist in the schema result
        // This avoids TypeError on read-only getters like req.query/req.params
        if (validated.body) req.body = validated.body;

        if (validated.query) {
            // Mutation is safer for req.query as it's often a getter in some environments
            Object.keys(req.query).forEach(key => delete req.query[key]);
            Object.assign(req.query, validated.query);
        }

        if (validated.params) {
            // Mutation is safer for req.params as it's often a getter
            Object.keys(req.params).forEach(key => delete req.params[key]);
            Object.assign(req.params, validated.params);
        }

        next();
    } catch (err) {
        next(err);
    }
};

export default validate;
