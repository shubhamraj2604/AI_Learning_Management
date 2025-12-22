export async function Delete(params) {
    const {courseId} = req.json()

    await db.Delete(S)
}