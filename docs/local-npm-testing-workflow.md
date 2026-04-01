# Workflow for testing packages locally before publishing

Based on suggestion from [here](https://github.com/lerna/lerna/issues/2363).

1. Setup [verdaccio](https://verdaccio.org/docs/installation) (standard setup, no need to change defaults. Once set up, just need to run `verdaccio`);
2. In a project in which you want to test the packages add .npmrc file with this line: `registry=http://localhost:4873`;
3. Run `npm run local-publish` script from ordao root; 
4. Test the packages in external project
   * Checkout out a new branch;
   * Run `npm update <pkg>...` for packages which got updated and need testing. See that required packages got updated;
   * Do the tests;
5. If packages work as expected
   * Run `npm run local-unpublish-all` to cleanup verdaccio registry;
   * Discard changes to ordao repo that `local-publish` script made (should be changes to lerna.json and package-lock.json);
   * Run `npm run publish` to publish changes to public npmjs registry;
   * In the external project
     * Merge changes from the test branch into the main branch except for package-lock.json;
     * Comment out registry setting in .npmrc
     * Do `npm update <pkg>...`;
     * Test again;
     * Commit and push if needed;
6. If packages do not work as expected;
   * Make required changes in the packages;
   * Commit them without commiting `lerna.json` and `package-lock.json` (or anything else that references the new versions);
   * Go back to step 3;
