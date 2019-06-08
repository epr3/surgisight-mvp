const { Router } = require('express');
const yup = require('yup');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const sessionController = require('../controllers/session');

const router = Router();

const sessionSchema = yup.object().shape({
  eventId: yup.string().required()
});
const updateSessionSchema = yup.object().shape({
  status: yup.string().required()
});

router.get('/sessions', jwtMiddleware, sessionController.getSessions);
router.get('/sessions/:id', jwtMiddleware, sessionController.getSession);
router.post(
  '/sessions',
  validationMiddleware(sessionSchema),
  jwtMiddleware,
  sessionController.postSession
);
router.put(
  '/sessions/:id',
  validationMiddleware(updateSessionSchema),
  jwtMiddleware,
  sessionController.putSession
);
router.delete('/sessions/:id', jwtMiddleware, sessionController.removeSession);

module.exports = router;
