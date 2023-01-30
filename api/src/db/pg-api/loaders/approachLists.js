export function approachLists(query) {
  return async (taskIds) => {
    const response = await query(statement, {
      $1: taskIds,
    });

    return taskIds.map((taskId) =>
      response.rows.filter((row) => taskId === row.taskId)
    );
  };
}

const statement = `
  SELECT id, content, user_id AS "userId", task_id AS "taskId", vote_count AS "voteCount", created_at AS "createdAt"
  FROM azdev.approaches
  WHERE task_id = ANY ($1)
  ORDER BY vote_count DESC, created_at DESC
`;
