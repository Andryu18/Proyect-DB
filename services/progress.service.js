const progressDao = require('../dao/progress.dao');
const usersService = require('./users.service');
const gamesService = require('./games.service');
const purchasesService = require('./purchases.service');
const achievementsService = require('./achievements.service');
const { invalidData } = require('../utils/checks');

const toState = ({ unlockedAt, ...achievement }) => ({
    ...achievement,
    unlocked: unlockedAt !== null && unlockedAt !== undefined,
    unlockedAt: unlockedAt ?? null
});

const listByGame = async (userId, gameId) => {
    await usersService.get(userId);
    await gamesService.get(gameId);
    await purchasesService.requireOwnership(userId, gameId);
    const achievements = (await progressDao.listByGame(userId, gameId)).map(toState);
    return {
        gameId,
        total: achievements.length,
        unlockedCount: achievements.filter((a) => a.unlocked).length,
        achievements
    };
};

const validatedProgress = (achievement, progress) => {
    if (progress === undefined) {
        throw invalidData([{ field: 'progress', message: 'A progress achievement requires the progress field.' }]);
    }
    if (progress > achievement.target) {
        throw invalidData([{
            field: 'progress',
            message: `Progress cannot exceed the achievement target (${achievement.target}).`
        }]);
    }
    return progress;
};

const requireUnlockFlag = (achievement, unlocked) => {
    if (unlocked !== true) {
        throw invalidData([{
            field: 'unlocked',
            message: `A ${achievement.type} achievement is recorded with unlocked: true.`
        }]);
    }
};

const record = async (userId, achievementId, { progress, unlocked }) => {
    await usersService.get(userId);
    const achievement = await achievementsService.get(achievementId);
    await purchasesService.requireOwnership(userId, achievement.gameId);

    const tracksProgress = achievement.type === achievementsService.PROGRESS_TYPE;
    let newProgress = 0;
    if (tracksProgress) {
        newProgress = validatedProgress(achievement, progress);
    } else {
        requireUnlockFlag(achievement, unlocked);
    }

    const unlock = !tracksProgress || newProgress >= achievement.target;
    await progressDao.save({ userId, achievementId, progress: newProgress, unlock });

    const state = await progressDao.find(userId, achievementId);
    return toState({ ...achievement, ...state });
};

module.exports = { listByGame, record };
