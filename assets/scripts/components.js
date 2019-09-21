const __cme_components__ = (function() {
  const CommitList = (commits) => {
    const items = commits.reduce(
      (acc, curr) => (acc + `<li class="commit-list__item">${curr.message}</li>`),
      ''
    );

    if (items === '') {
      return '<div class="commit-list">No recent commits</div>';
    }

    return `<ul class="commit-list">${items}</ul>`;
  }

  return {
    CommitList
  };

})();
