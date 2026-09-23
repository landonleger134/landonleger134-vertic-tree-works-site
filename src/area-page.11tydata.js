module.exports = {
  eleventyComputed: {
    title: (d) => `Tree Service ${d.a.city} LA | Removal & Trimming`,
    description: (d) => d.a.description,
    crumbs: (d) => [["Service areas", "/areas/"], [d.a.city]],
  },
};
