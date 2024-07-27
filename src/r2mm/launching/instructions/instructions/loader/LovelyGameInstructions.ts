import GameInstructionGenerator from '../GameInstructionGenerator';
import { GameInstruction } from '../../GameInstructions';
import Game from '../../../../../model/game/Game';
import Profile from '../../../../../model/Profile';
import * as path from 'path';

export default class LovelyGameInstructions extends GameInstructionGenerator {

    public async generate(game: Game, profile: Profile): Promise<GameInstruction> {
        const modDir = path.join(profile.getPathOfProfile(), "mods");

        return {
            moddedParameters: `--mod-dir "${modDir}"`,
            vanillaParameters: "--vanilla"
        };
    }
}
