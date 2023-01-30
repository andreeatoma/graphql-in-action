import { TASKS_TYPES } from '../constants';

export function getTasksByTypes(query) {
  return async (types) => {
    const results = types.map(async (type) => {
      if (type === TASKS_TYPES.latest) {
        const response = await query(statement);

        return response.rows;
      }

      throw new Error('Unsupported task type');
    });

    return Promise.all(results);
  };
}

const statement = `
  SELECT id, content, tags,
    user_id AS "userId",
    approach_count AS "approachCount",
    is_private AS "isPrivate",
    created_at AS "createdAt"
  FROM azdev.tasks
  WHERE is_private = FALSE
  ORDER BY created_at DESC
  LIMIT 100
`;
