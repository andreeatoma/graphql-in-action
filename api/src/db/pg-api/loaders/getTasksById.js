export function getTasksById(query) {
  return async ({ taskIds, currentUser }) => {
    const response = await query(statement, {
      $1: taskIds,
      $2: currentUser ? currentUser.id : null,
    });

    return taskIds.map((taskId) =>
      response.rows.find((row) => taskId == row.id)
    );
  };
}

const statement = `
  SELECT id, content, tags, user_id AS "userId", approach_count AS "approachCount", is_private AS "isPrivate", created_at AS "createdAt"
  FROM azdev.tasks
  WHERE id = ANY ($1)
  AND (is_private = FALSE OR user_id = $2)
`;
