import ThunderstoreMod from '../model/ThunderstoreMod';

export class Deprecations {

    public static getDeprecatedPackageMap(packages: ThunderstoreMod[]): Map<string, boolean> {
        const packageMap = packages.reduce((map, pkg) => {
            map.set(pkg.getFullName(), pkg);
            return map;
        }, new Map<String, ThunderstoreMod>());
        const deprecationMap = new Map<string, boolean>();
        const currentChain = new Set<string>();

        packages.forEach(pkg => {
            this._populateDeprecatedPackageMapForModChain(pkg, packageMap, deprecationMap, currentChain);
        });

        return deprecationMap;
    }

    /**
     * "Smart" package deprecation determination by keeping track of previously determined dependencies.
     * This ensures that we hit as few iterations as possible to speed up calculation time.
     *
     * @param mod The mod to check for deprecation status / deprecated dependencies
     * @param deprecationMap A map to record previously hit items
     * @param currentChain A set to record recursion stack to avoid infinite loops
     * @public (to allow tests to mock the function)
     */
    public static _populateDeprecatedPackageMapForModChain(
        mod: ThunderstoreMod,
        packageMap: Map<String, ThunderstoreMod>,
        deprecationMap: Map<string, boolean>,
        currentChain: Set<string>
    ): boolean {
        const previouslyCalculatedValue = deprecationMap.get(mod.getFullName());
        if (previouslyCalculatedValue !== undefined) {
            return previouslyCalculatedValue;
        }

        // No need to check dependencies if the mod itself is deprecated.
        // Dependencies will be checked by the for-loop in the calling
        // function anyway.
        if (mod.isDeprecated()) {
            deprecationMap.set(mod.getFullName(), true);
            return true;
        }

        // TODO: it was deemed that just fixing this function would be a
        // breaking change. We need to make changes to UI before the fix
        // can go live. Once ready, remove the two lines below and
        // uncomment the rest.
        deprecationMap.set(mod.getFullName(), false);
        return false;

        // for (const dependencyNameAndVersion of mod.getLatestVersion().getDependencies()) {
        //     const dependencyName = dependencyNameAndVersion.substring(0, dependencyNameAndVersion.lastIndexOf('-'));

        //     if (currentChain.has(dependencyName)) {
        //         continue;
        //     }
        //     const dependency = packageMap.get(dependencyName);

        //     // Package isn't available on Thunderstore, so we can't tell
        //     // if it's deprecated or not. This will also include deps of
        //     // packages uploaded into wrong community since the
        //     // packageMap contains only packages from this community.
        //     // Based on manual testing with real data, caching these to
        //     // deprecationMap doesn't seem to improve overall performance.
        //     if (dependency === undefined) {
        //         continue;
        //     }

        //     // Keep track of the dependency chain currently under
        //     // investigation to avoid infinite recursive loops.
        //     currentChain.add(mod.getFullName());
        //     const dependencyDeprecated = this._populateDeprecatedPackageMapForModChain(
        //         dependency, packageMap, deprecationMap, currentChain
        //     );
        //     currentChain.delete(mod.getFullName());
        //     deprecationMap.set(dependencyName, dependencyDeprecated);

        //     // Eject early on the first deprecated dependency for performance.
        //     if (dependencyDeprecated) {
        //         deprecationMap.set(mod.getFullName(), true);
        //         return true;
        //     }
        // }

        // // Package is not depreceated by itself nor due to dependencies.
        // deprecationMap.set(mod.getFullName(), false);
        // return false;
    }
}
