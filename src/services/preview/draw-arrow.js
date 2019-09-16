function drawHead(ctx, x0, y0, x1, y1, x2, y2, style, color, width) {
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = width
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    let backdist
    let cp1x, cp1y, cp2x, cp2y
    let cpx, cpy, shiftamt
    switch (style) {
        case 0:
            backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)))
            ctx.arcTo(x1, y1, x0, y0, .55 * backdist)
            ctx.fill()
            break
        case 1:
            ctx.beginPath()
            ctx.moveTo(x0, y0)
            ctx.lineTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.lineTo(x0, y0)
            ctx.fill()
            break
        case 2:
            ctx.stroke()
            break
        case 3:
            cpx = (x0 + x1 + x2) / 3
            cpy = (y0 + y1 + y2) / 3
            ctx.quadraticCurveTo(cpx, cpy, x0, y0)
            ctx.fill()
            break
        case 4:
            cp1x, cp1y, cp2x, cp2y
            shiftamt = 5
            if (x2 == x0) {
                backdist = y2 - y0
                cp1x = (x1 + x0) / 2
                cp2x = (x1 + x0) / 2
                cp1y = y1 + backdist / shiftamt
                cp2y = y1 - backdist / shiftamt
            } else {
                backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)))
                let xback = (x0 + x2) / 2
                let yback = (y0 + y2) / 2
                let xmid = (xback + x1) / 2
                let ymid = (yback + y1) / 2
                let m = (y2 - y0) / (x2 - x0)
                let dx = (backdist / (2 * Math.sqrt(m * m + 1))) / shiftamt
                let dy = m * dx
                cp1x = xmid - dx
                cp1y = ymid - dy
                cp2x = xmid + dx
                cp2y = ymid + dy
            }
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0)
            ctx.fill()
            break
    }
    ctx.restore()
}

function drawArrow(ctx, x1, y1, x2, y2, which = 0, color = '#000', width, isDash,d = 9,style = 3, angle = Math.PI / 7) {
    d = width * d / 2
    let dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
    let ratio = (dist - d / 3) / dist
    let tox, toy, fromx, fromy
    if (which == 1 || which == 3) {
        tox = Math.round(x1 + (x2 - x1) * ratio)
        toy = Math.round(y1 + (y2 - y1) * ratio)
    } else {
        tox = x2
        toy = y2
    }

    if (which == 2 || which == 3) {
        fromx = x1 + (x2 - x1) * (1 - ratio)
        fromy = y1 + (y2 - y1) * (1 - ratio)
    } else {
        fromx = x1
        fromy = y1
    }

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = width
    if(isDash) {
        ctx.setLineDash([15,15])
    }
    ctx.moveTo(fromx, fromy)
    ctx.lineTo(tox, toy)
    ctx.stroke()

    let lineangle = Math.atan2(y2 - y1, x2 - x1)
    let h = Math.abs(d / Math.cos(angle))
    let angle1, topx, topy, angle2, botx, boty
    if (which == 1 || which == 3) {
        angle1 = lineangle + Math.PI + angle
        topx = x2 + Math.cos(angle1) * h
        topy = y2 + Math.sin(angle1) * h
        angle2 = lineangle + Math.PI - angle
        botx = x2 + Math.cos(angle2) * h
        boty = y2 + Math.sin(angle2) * h
        drawHead(ctx, topx, topy, x2, y2, botx, boty, style, color, width)
    }

    if (which == 2 || which == 3) {
        angle1 = lineangle + angle
        topx = x1 + Math.cos(angle1) * h
        topy = y1 + Math.sin(angle1) * h
        angle2 = lineangle - angle
        botx = x1 + Math.cos(angle2) * h
        boty = y1 + Math.sin(angle2) * h
        drawHead(ctx, topx, topy, x1, y1, botx, boty, style, color, width)
    }
}

export {
    drawArrow,
}